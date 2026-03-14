#!/usr/bin/env python3
"""
Baseline Comparison Tool
Compare current benchmark results with baseline to detect regressions
"""

import sys
import json
from pathlib import Path
from typing import Dict, Tuple

def load_json(filepath: str) -> Dict:
    """Load JSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)

def calculate_improvement(baseline: float, current: float) -> Tuple[float, str]:
    """
    Calculate improvement percentage and status

    Returns:
        (percentage, status)
        - percentage: positive = improvement, negative = regression
        - status: 'improved', 'regression', 'unchanged'
    """
    if baseline == 0:
        return 0.0, 'unchanged'

    percentage = ((baseline - current) / baseline) * 100

    if percentage > 5:
        return percentage, 'improved'
    elif percentage < -5:
        return percentage, 'regression'
    else:
        return percentage, 'unchanged'

def compare_e2e_results(baseline: Dict, current: Dict) -> Dict:
    """Compare end-to-end benchmark results"""
    comparison = {
        'by_test_case': {},
        'summary': {
            'regressions': [],
            'improvements': [],
            'unchanged': []
        }
    }

    baseline_results = {r['test_case']: r for r in baseline['results'] if r['success']}
    current_results = {r['test_case']: r for r in current['results'] if r['success']}

    for test_case in baseline_results.keys():
        if test_case not in current_results:
            continue

        base = baseline_results[test_case]
        curr = current_results[test_case]

        # Compare total duration
        total_improvement, total_status = calculate_improvement(
            base['total_duration_ms'],
            curr['total_duration_ms']
        )

        # Compare stages
        stage_comparisons = {}
        for stage in ['tts', 'asr', 'scene', 'render']:
            stage_key = f'{stage}_duration_ms'
            if stage_key in base and stage_key in curr:
                improvement, status = calculate_improvement(
                    base[stage_key],
                    curr[stage_key]
                )
                stage_comparisons[stage] = {
                    'baseline_ms': base[stage_key],
                    'current_ms': curr[stage_key],
                    'improvement_pct': improvement,
                    'status': status
                }

        comparison['by_test_case'][test_case] = {
            'baseline_total_ms': base['total_duration_ms'],
            'current_total_ms': curr['total_duration_ms'],
            'improvement_pct': total_improvement,
            'status': total_status,
            'stages': stage_comparisons
        }

        # Track in summary
        if total_status == 'regression':
            comparison['summary']['regressions'].append({
                'test_case': test_case,
                'improvement_pct': total_improvement
            })
        elif total_status == 'improved':
            comparison['summary']['improvements'].append({
                'test_case': test_case,
                'improvement_pct': total_improvement
            })
        else:
            comparison['summary']['unchanged'].append(test_case)

    return comparison

def compare_tts_results(baseline: Dict, current: Dict) -> Dict:
    """Compare TTS benchmark results"""
    comparison = {
        'by_provider': {},
        'summary': {
            'regressions': [],
            'improvements': [],
            'unchanged': []
        }
    }

    # Group by provider
    baseline_by_provider = {}
    for r in baseline['results']:
        if r['success']:
            provider = r['provider']
            baseline_by_provider.setdefault(provider, []).append(r['duration_ms'])

    current_by_provider = {}
    for r in current['results']:
        if r['success']:
            provider = r['provider']
            current_by_provider.setdefault(provider, []).append(r['duration_ms'])

    # Compare averages
    for provider in baseline_by_provider.keys():
        if provider not in current_by_provider:
            continue

        base_avg = sum(baseline_by_provider[provider]) / len(baseline_by_provider[provider])
        curr_avg = sum(current_by_provider[provider]) / len(current_by_provider[provider])

        improvement, status = calculate_improvement(base_avg, curr_avg)

        comparison['by_provider'][provider] = {
            'baseline_avg_ms': int(base_avg),
            'current_avg_ms': int(curr_avg),
            'improvement_pct': improvement,
            'status': status
        }

        # Track in summary
        if status == 'regression':
            comparison['summary']['regressions'].append({
                'provider': provider,
                'improvement_pct': improvement
            })
        elif status == 'improved':
            comparison['summary']['improvements'].append({
                'provider': provider,
                'improvement_pct': improvement
            })
        else:
            comparison['summary']['unchanged'].append(provider)

    return comparison

def compare_asr_results(baseline: Dict, current: Dict) -> Dict:
    """Compare ASR benchmark results"""
    # Similar structure to TTS comparison
    comparison = {
        'by_provider': {},
        'summary': {
            'regressions': [],
            'improvements': [],
            'unchanged': []
        }
    }

    # Group by provider
    baseline_by_provider = {}
    for r in baseline['results']:
        if r['success']:
            provider = r['provider']
            baseline_by_provider.setdefault(provider, []).append(r['duration_ms'])

    current_by_provider = {}
    for r in current['results']:
        if r['success']:
            provider = r['provider']
            current_by_provider.setdefault(provider, []).append(r['duration_ms'])

    # Compare averages
    for provider in baseline_by_provider.keys():
        if provider not in current_by_provider:
            continue

        base_avg = sum(baseline_by_provider[provider]) / len(baseline_by_provider[provider])
        curr_avg = sum(current_by_provider[provider]) / len(current_by_provider[provider])

        improvement, status = calculate_improvement(base_avg, curr_avg)

        comparison['by_provider'][provider] = {
            'baseline_avg_ms': int(base_avg),
            'current_avg_ms': int(curr_avg),
            'improvement_pct': improvement,
            'status': status
        }

        # Track in summary
        if status == 'regression':
            comparison['summary']['regressions'].append({
                'provider': provider,
                'improvement_pct': improvement
            })
        elif status == 'improved':
            comparison['summary']['improvements'].append({
                'provider': provider,
                'improvement_pct': improvement
            })
        else:
            comparison['summary']['unchanged'].append(provider)

    return comparison

def print_e2e_comparison(comparison: Dict):
    """Print end-to-end comparison results"""
    print("\n" + "="*70)
    print("END-TO-END PERFORMANCE COMPARISON")
    print("="*70 + "\n")

    # Test case comparison
    for test_case, data in sorted(comparison['by_test_case'].items()):
        status_icon = {
            'improved': '✅',
            'regression': '❌',
            'unchanged': '➡️'
        }[data['status']]

        print(f"{test_case} Video: {status_icon} {data['status'].upper()}")
        print(f"  Baseline:  {data['baseline_total_ms']:>6} ms")
        print(f"  Current:   {data['current_total_ms']:>6} ms")
        print(f"  Change:    {data['improvement_pct']:>6.1f}%")

        # Show stage-by-stage
        print(f"\n  Stage Breakdown:")
        for stage, stage_data in data['stages'].items():
            stage_icon = {
                'improved': '✅',
                'regression': '❌',
                'unchanged': '➡️'
            }[stage_data['status']]

            print(f"    {stage.upper():<8} {stage_icon}  "
                  f"{stage_data['baseline_ms']:>5}ms → {stage_data['current_ms']:>5}ms  "
                  f"({stage_data['improvement_pct']:>+6.1f}%)")
        print()

    # Summary
    print("\nSummary:")
    print("-" * 70)
    print(f"Improvements:   {len(comparison['summary']['improvements'])}")
    print(f"Regressions:    {len(comparison['summary']['regressions'])}")
    print(f"Unchanged:      {len(comparison['summary']['unchanged'])}")

    if comparison['summary']['regressions']:
        print("\n⚠️  REGRESSIONS DETECTED:")
        for reg in comparison['summary']['regressions']:
            print(f"  - {reg['test_case']}: {reg['improvement_pct']:.1f}% slower")

def print_tts_comparison(comparison: Dict):
    """Print TTS comparison results"""
    print("\n" + "="*70)
    print("TTS PROVIDER PERFORMANCE COMPARISON")
    print("="*70 + "\n")

    # Provider comparison
    print(f"{'Provider':<12} {'Status':<12} {'Baseline':<12} {'Current':<12} {'Change':<10}")
    print("-" * 70)

    for provider, data in sorted(comparison['by_provider'].items()):
        status_icon = {
            'improved': '✅ Better',
            'regression': '❌ Worse',
            'unchanged': '➡️  Same'
        }[data['status']]

        print(f"{provider:<12} {status_icon:<12} "
              f"{data['baseline_avg_ms']:>6} ms  "
              f"{data['current_avg_ms']:>6} ms  "
              f"{data['improvement_pct']:>+6.1f}%")

    # Summary
    print("\nSummary:")
    print("-" * 70)
    print(f"Improvements:   {len(comparison['summary']['improvements'])}")
    print(f"Regressions:    {len(comparison['summary']['regressions'])}")
    print(f"Unchanged:      {len(comparison['summary']['unchanged'])}")

    if comparison['summary']['regressions']:
        print("\n⚠️  REGRESSIONS DETECTED:")
        for reg in comparison['summary']['regressions']:
            print(f"  - {reg['provider']}: {reg['improvement_pct']:.1f}% slower")

def print_asr_comparison(comparison: Dict):
    """Print ASR comparison results"""
    print("\n" + "="*70)
    print("ASR PROVIDER PERFORMANCE COMPARISON")
    print("="*70 + "\n")

    # Provider comparison
    print(f"{'Provider':<12} {'Status':<12} {'Baseline':<12} {'Current':<12} {'Change':<10}")
    print("-" * 70)

    for provider, data in sorted(comparison['by_provider'].items()):
        status_icon = {
            'improved': '✅ Better',
            'regression': '❌ Worse',
            'unchanged': '➡️  Same'
        }[data['status']]

        print(f"{provider:<12} {status_icon:<12} "
              f"{data['baseline_avg_ms']:>6} ms  "
              f"{data['current_avg_ms']:>6} ms  "
              f"{data['improvement_pct']:>+6.1f}%")

    # Summary
    print("\nSummary:")
    print("-" * 70)
    print(f"Improvements:   {len(comparison['summary']['improvements'])}")
    print(f"Regressions:    {len(comparison['summary']['regressions'])}")
    print(f"Unchanged:      {len(comparison['summary']['unchanged'])}")

    if comparison['summary']['regressions']:
        print("\n⚠️  REGRESSIONS DETECTED:")
        for reg in comparison['summary']['regressions']:
            print(f"  - {reg['provider']}: {reg['improvement_pct']:.1f}% slower")

def main():
    if len(sys.argv) < 3:
        print("Usage: compare-baselines.py <baseline.json> <current.json>")
        print("\nExamples:")
        print("  # Compare E2E results")
        print("  python3 compare-baselines.py baselines/v1.4.4-e2e.json results/e2e-benchmark-latest.json")
        print("\n  # Compare TTS results")
        print("  python3 compare-baselines.py baselines/v1.4.4-tts.json results/tts-benchmark-latest.json")
        sys.exit(1)

    baseline_path = sys.argv[1]
    current_path = sys.argv[2]

    if not Path(baseline_path).exists():
        print(f"Error: Baseline file not found: {baseline_path}")
        sys.exit(1)

    if not Path(current_path).exists():
        print(f"Error: Current file not found: {current_path}")
        sys.exit(1)

    # Load data
    baseline = load_json(baseline_path)
    current = load_json(current_path)

    # Determine type and compare
    if 'e2e-benchmark' in baseline_path or 'e2e-benchmark' in current_path:
        comparison = compare_e2e_results(baseline, current)
        print_e2e_comparison(comparison)
    elif 'tts-benchmark' in baseline_path or 'tts-benchmark' in current_path:
        comparison = compare_tts_results(baseline, current)
        print_tts_comparison(comparison)
    elif 'asr-benchmark' in baseline_path or 'asr-benchmark' in current_path:
        comparison = compare_asr_results(baseline, current)
        print_asr_comparison(comparison)
    else:
        print("Error: Cannot determine benchmark type from filenames")
        sys.exit(1)

    # Exit with error if regressions detected
    if comparison['summary']['regressions']:
        print("\n❌ Performance regressions detected")
        sys.exit(1)
    else:
        print("\n✅ No performance regressions detected")
        sys.exit(0)

if __name__ == "__main__":
    main()
