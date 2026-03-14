#!/usr/bin/env python3
"""
Performance Analysis Tool
Analyzes benchmark results and provides statistical insights
"""

import sys
import json
import statistics
from pathlib import Path
from typing import Dict, List, Any

def load_results(filepath: str) -> Dict:
    """Load benchmark results from JSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)

def analyze_tts_results(results: List[Dict]) -> Dict:
    """Analyze TTS benchmark results"""
    analysis = {
        'by_provider': {},
        'by_test_case': {},
        'summary': {}
    }

    # Group by provider
    for result in results:
        provider = result['provider']
        test_case = result['test_case']

        if provider not in analysis['by_provider']:
            analysis['by_provider'][provider] = {
                'total': 0,
                'success': 0,
                'failed': 0,
                'durations': [],
                'avg_duration': 0,
                'min_duration': 0,
                'max_duration': 0,
                'success_rate': 0
            }

        if test_case not in analysis['by_test_case']:
            analysis['by_test_case'][test_case] = {
                'results': []
            }

        analysis['by_provider'][provider]['total'] += 1
        analysis['by_test_case'][test_case]['results'].append(result)

        if result['success']:
            analysis['by_provider'][provider]['success'] += 1
            analysis['by_provider'][provider]['durations'].append(result['duration_ms'])
        else:
            analysis['by_provider'][provider]['failed'] += 1

    # Calculate statistics
    for provider, data in analysis['by_provider'].items():
        if data['durations']:
            data['avg_duration'] = int(statistics.mean(data['durations']))
            data['min_duration'] = min(data['durations'])
            data['max_duration'] = max(data['durations'])
            data['median_duration'] = int(statistics.median(data['durations']))
            if len(data['durations']) > 1:
                data['stdev_duration'] = int(statistics.stdev(data['durations']))
            else:
                data['stdev_duration'] = 0

        if data['total'] > 0:
            data['success_rate'] = (data['success'] / data['total']) * 100

    # Find best provider
    best_avg = None
    best_median = None
    best_success = None

    for provider, data in analysis['by_provider'].items():
        if data['success'] == 0:
            continue

        if best_avg is None or data['avg_duration'] < analysis['by_provider'][best_avg]['avg_duration']:
            best_avg = provider

        if best_median is None or data['median_duration'] < analysis['by_provider'][best_median]['median_duration']:
            best_median = provider

        if best_success is None or data['success_rate'] > analysis['by_provider'][best_success]['success_rate']:
            best_success = provider

    analysis['summary'] = {
        'best_avg_speed': best_avg,
        'best_median_speed': best_median,
        'best_success_rate': best_success,
        'total_tests': len(results),
        'total_success': sum(1 for r in results if r['success']),
        'total_failed': sum(1 for r in results if not r['success'])
    }

    return analysis

def analyze_asr_results(results: List[Dict]) -> Dict:
    """Analyze ASR benchmark results"""
    analysis = {
        'by_provider': {},
        'by_audio': {},
        'summary': {}
    }

    # Group by provider
    for result in results:
        provider = result['provider']
        audio = result['audio_file']

        if provider not in analysis['by_provider']:
            analysis['by_provider'][provider] = {
                'total': 0,
                'success': 0,
                'failed': 0,
                'durations': [],
                'avg_duration': 0,
                'success_rate': 0
            }

        if audio not in analysis['by_audio']:
            analysis['by_audio'][audio] = {
                'results': []
            }

        analysis['by_provider'][provider]['total'] += 1
        analysis['by_audio'][audio]['results'].append(result)

        if result['success']:
            analysis['by_provider'][provider]['success'] += 1
            analysis['by_provider'][provider]['durations'].append(result['duration_ms'])
        else:
            analysis['by_provider'][provider]['failed'] += 1

    # Calculate statistics
    for provider, data in analysis['by_provider'].items():
        if data['durations']:
            data['avg_duration'] = int(statistics.mean(data['durations']))
            data['min_duration'] = min(data['durations'])
            data['max_duration'] = max(data['durations'])
            data['median_duration'] = int(statistics.median(data['durations']))
            if len(data['durations']) > 1:
                data['stdev_duration'] = int(statistics.stdev(data['durations']))
            else:
                data['stdev_duration'] = 0

        if data['total'] > 0:
            data['success_rate'] = (data['success'] / data['total']) * 100

    # Find best provider
    best_avg = None
    best_success = None

    for provider, data in analysis['by_provider'].items():
        if data['success'] == 0:
            continue

        if best_avg is None or data['avg_duration'] < analysis['by_provider'][best_avg]['avg_duration']:
            best_avg = provider

        if best_success is None or data['success_rate'] > analysis['by_provider'][best_success]['success_rate']:
            best_success = provider

    analysis['summary'] = {
        'best_avg_speed': best_avg,
        'best_success_rate': best_success,
        'total_tests': len(results),
        'total_success': sum(1 for r in results if r['success']),
        'total_failed': sum(1 for r in results if not r['success'])
    }

    return analysis

def analyze_e2e_results(results: List[Dict]) -> Dict:
    """Analyze end-to-end pipeline results"""
    analysis = {
        'by_test_case': {},
        'bottleneck_analysis': {},
        'summary': {}
    }

    successful_results = [r for r in results if r['success']]

    if not successful_results:
        return analysis

    # Analyze stage durations
    stage_totals = {
        'tts': [],
        'asr': [],
        'scene': [],
        'render': []
    }

    for result in successful_results:
        test_case = result['test_case']

        if test_case not in analysis['by_test_case']:
            analysis['by_test_case'][test_case] = result

        stage_totals['tts'].append(result['tts_duration_ms'])
        stage_totals['asr'].append(result['asr_duration_ms'])
        stage_totals['scene'].append(result['scene_duration_ms'])
        stage_totals['render'].append(result['render_duration_ms'])

    # Calculate stage statistics
    for stage, durations in stage_totals.items():
        if durations:
            analysis['bottleneck_analysis'][stage] = {
                'avg_duration': int(statistics.mean(durations)),
                'min_duration': min(durations),
                'max_duration': max(durations),
                'median_duration': int(statistics.median(durations)),
                'total_time': sum(durations),
                'percentage': 0  # Will calculate after total
            }

    # Calculate percentages
    total_time = sum(data['total_time'] for data in analysis['bottleneck_analysis'].values())
    for stage, data in analysis['bottleneck_analysis'].items():
        data['percentage'] = (data['total_time'] / total_time * 100) if total_time > 0 else 0

    # Find bottleneck
    bottleneck = max(
        analysis['bottleneck_analysis'].items(),
        key=lambda x: x[1]['percentage']
    )

    analysis['summary'] = {
        'total_tests': len(results),
        'successful': len(successful_results),
        'failed': len(results) - len(successful_results),
        'bottleneck_stage': bottleneck[0],
        'bottleneck_percentage': bottleneck[1]['percentage']
    }

    return analysis

def print_tts_analysis(analysis: Dict):
    """Print TTS analysis results"""
    print("\n" + "="*60)
    print("TTS PROVIDER PERFORMANCE ANALYSIS")
    print("="*60 + "\n")

    # Provider comparison
    print("Provider Comparison:")
    print("-" * 60)
    print(f"{'Provider':<12} {'Success Rate':<15} {'Avg (ms)':<12} {'Median (ms)':<12}")
    print("-" * 60)

    for provider, data in sorted(analysis['by_provider'].items()):
        print(f"{provider:<12} {data['success_rate']:>6.1f}% ({data['success']}/{data['total']})  "
              f"{data.get('avg_duration', 'N/A'):>10}  {data.get('median_duration', 'N/A'):>10}")

    print("\n" + "Summary:")
    print("-" * 60)
    print(f"Best Average Speed:   {analysis['summary']['best_avg_speed']}")
    print(f"Best Median Speed:    {analysis['summary']['best_median_speed']}")
    print(f"Best Success Rate:    {analysis['summary']['best_success_rate']}")
    print(f"Total Tests:          {analysis['summary']['total_tests']}")
    print(f"Total Success:        {analysis['summary']['total_success']}")
    print(f"Total Failed:         {analysis['summary']['total_failed']}")

def print_asr_analysis(analysis: Dict):
    """Print ASR analysis results"""
    print("\n" + "="*60)
    print("ASR PROVIDER PERFORMANCE ANALYSIS")
    print("="*60 + "\n")

    # Provider comparison
    print("Provider Comparison:")
    print("-" * 60)
    print(f"{'Provider':<12} {'Success Rate':<15} {'Avg (ms)':<12} {'Median (ms)':<12}")
    print("-" * 60)

    for provider, data in sorted(analysis['by_provider'].items()):
        print(f"{provider:<12} {data['success_rate']:>6.1f}% ({data['success']}/{data['total']})  "
              f"{data.get('avg_duration', 'N/A'):>10}  {data.get('median_duration', 'N/A'):>10}")

    print("\nSummary:")
    print("-" * 60)
    print(f"Best Average Speed:   {analysis['summary']['best_avg_speed']}")
    print(f"Best Success Rate:    {analysis['summary']['best_success_rate']}")
    print(f"Total Tests:          {analysis['summary']['total_tests']}")
    print(f"Total Success:        {analysis['summary']['total_success']}")
    print(f"Total Failed:         {analysis['summary']['total_failed']}")

def print_e2e_analysis(analysis: Dict):
    """Print end-to-end analysis results"""
    print("\n" + "="*60)
    print("END-TO-END PIPELINE PERFORMANCE ANALYSIS")
    print("="*60 + "\n")

    # Test case results
    print("Test Case Results:")
    print("-" * 60)
    for test_case, data in sorted(analysis['by_test_case'].items()):
        print(f"\n{test_case} Video:")
        print(f"  Total Time:      {data['total_duration_ms']:>6} ms")
        print(f"  TTS:             {data['tts_duration_ms']:>6} ms")
        print(f"  ASR:             {data['asr_duration_ms']:>6} ms")
        print(f"  Scene Gen:       {data['scene_duration_ms']:>6} ms")
        print(f"  Rendering:       {data['render_duration_ms']:>6} ms")
        print(f"  Video Duration:  {data.get('video_duration_ms', 'N/A'):>6} ms")

    # Bottleneck analysis
    print("\n\nBottleneck Analysis:")
    print("-" * 60)
    print(f"{'Stage':<15} {'Avg (ms)':<12} {'% of Total':<12} {'Total (ms)':<12}")
    print("-" * 60)

    for stage, data in sorted(analysis['bottleneck_analysis'].items(),
                              key=lambda x: x[1]['percentage'], reverse=True):
        print(f"{stage.upper():<15} {data['avg_duration']:>10}  {data['percentage']:>8.1f}%  {data['total_time']:>10}")

    print("\n\nSummary:")
    print("-" * 60)
    print(f"Bottleneck Stage:     {analysis['summary']['bottleneck_stage'].upper()}")
    print(f"Bottleneck %:         {analysis['summary']['bottleneck_percentage']:.1f}%")
    print(f"Total Tests:          {analysis['summary']['total_tests']}")
    print(f"Successful:           {analysis['summary']['successful']}")
    print(f"Failed:               {analysis['summary']['failed']}")

def main():
    if len(sys.argv) < 2:
        print("Usage: analyze-performance.py <results.json>")
        print("\nSupported result types:")
        print("  - tts-benchmark-*.json")
        print("  - asr-benchmark-*.json")
        print("  - e2e-benchmark-*.json")
        sys.exit(1)

    filepath = sys.argv[1]

    if not Path(filepath).exists():
        print(f"Error: File not found: {filepath}")
        sys.exit(1)

    # Load results
    data = load_results(filepath)

    # Determine type and analyze
    if 'tts-benchmark' in filepath:
        analysis = analyze_tts_results(data['results'])
        print_tts_analysis(analysis)
    elif 'asr-benchmark' in filepath:
        analysis = analyze_asr_results(data['results'])
        print_asr_analysis(analysis)
    elif 'e2e-benchmark' in filepath:
        analysis = analyze_e2e_results(data['results'])
        print_e2e_analysis(analysis)
    else:
        print("Error: Unknown benchmark type")
        sys.exit(1)

if __name__ == "__main__":
    main()
