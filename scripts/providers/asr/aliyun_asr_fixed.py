#!/usr/bin/env python3
"""
Aliyun ASR - Fixed Implementation using SDK
使用阿里云官方 SDK 获取 token

依赖: pip install aliyun-python-sdk-core
"""

import sys
import os
import json
import re

def split_text_to_segments(text, total_duration):
    """根据标点符号智能分割文本并估算时间戳

    Args:
        text: 完整识别文本
        total_duration: 音频总时长（秒）

    Returns:
        包含多个 segment 的列表，每个 segment 有 start/end/text
    """
    # 按中文标点符号分割（句号、问号、感叹号、换行）
    # 同时保留逗号作为短暂停顿的标记
    sentences = re.split(r'[。！？\n]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    if not sentences:
        # 如果没有标点，返回整段文本
        return [{
            'start': 0.0,
            'end': total_duration,
            'text': text
        }]

    # 按字符数比例分配时间
    total_chars = sum(len(s) for s in sentences)
    if total_chars == 0:
        return [{
            'start': 0.0,
            'end': total_duration,
            'text': text
        }]

    segments = []
    current_time = 0.0

    for i, sentence in enumerate(sentences):
        # 计算该句子的时长（按字符比例）
        char_ratio = len(sentence) / total_chars
        duration = total_duration * char_ratio

        # 为最后一句调整结束时间，避免浮点误差
        if i == len(sentences) - 1:
            end_time = total_duration
        else:
            end_time = current_time + duration

        segments.append({
            'start': round(current_time, 3),
            'end': round(end_time, 3),
            'text': sentence
        })

        current_time = end_time

    return segments

def transcribe_audio(audio_file, output_json, language="zh"):
    """调用阿里云一句话识别 API"""
    import requests
    from aliyunsdkcore.client import AcsClient
    from aliyunsdkcore.request import CommonRequest

    access_key_id = os.environ.get('ALIYUN_ACCESS_KEY_ID')
    access_key_secret = os.environ.get('ALIYUN_ACCESS_KEY_SECRET')
    app_key = os.environ.get('ALIYUN_APP_KEY')

    if not all([access_key_id, access_key_secret, app_key]):
        print("❌ Missing Aliyun credentials", file=sys.stderr)
        return False

    if not os.path.exists(audio_file):
        print(f"❌ Audio file not found: {audio_file}", file=sys.stderr)
        return False

    try:
        # 使用 SDK 获取 token
        client = AcsClient(access_key_id, access_key_secret, 'cn-shanghai')

        request = CommonRequest()
        request.set_accept_format('json')
        request.set_domain('nls-meta.cn-shanghai.aliyuncs.com')
        request.set_method('POST')
        request.set_protocol_type('https')
        request.set_version('2019-02-28')
        request.set_action_name('CreateToken')

        response = client.do_action_with_exception(request)
        result = json.loads(response)

        if 'Token' not in result or 'Id' not in result['Token']:
            print(f"❌ Invalid token response: {result}", file=sys.stderr)
            return False

        token = result['Token']['Id']
        print(f"✅ Got token", file=sys.stderr)

        # 读取音频文件
        with open(audio_file, 'rb') as f:
            audio_data = f.read()

        # 使用一句话识别 API
        asr_url = "https://nls-gateway.cn-shanghai.aliyuncs.com/stream/v1/asr"

        headers = {
            'Content-Type': 'application/octet-stream'
        }

        asr_params = {
            'appkey': app_key,
            'token': token,
            'format': 'mp3',
            'enable_punctuation_prediction': 'true',
            'enable_inverse_text_normalization': 'true',
            'enable_intermediate_result': 'false'
        }

        asr_response = requests.post(
            asr_url,
            params=asr_params,
            headers=headers,
            data=audio_data,
            timeout=60
        )

        if asr_response.status_code == 200:
            result = asr_response.json()

            if 'result' in result:
                text = result['result']

                # 阿里云一句话识别不返回时间戳
                # 使用 ffprobe 获取真实音频时长
                import subprocess
                try:
                    duration_output = subprocess.check_output([
                        'ffprobe', '-v', 'error',
                        '-show_entries', 'format=duration',
                        '-of', 'default=noprint_wrappers=1:nokey=1',
                        audio_file
                    ], stderr=subprocess.STDOUT, text=True)
                    audio_duration = float(duration_output.strip())
                    print(f"✅ Audio duration: {audio_duration:.3f}s", file=sys.stderr)
                except Exception as e:
                    # 降级：使用文件大小估算（不准确但总比没有好）
                    file_size = os.path.getsize(audio_file)
                    audio_duration = file_size / 16000
                    print(f"⚠️  ffprobe failed, using estimate: {audio_duration:.3f}s", file=sys.stderr)

                # 使用智能分段生成多个时间戳片段
                segments = split_text_to_segments(text, audio_duration)

                # 保存为 JSON
                with open(output_json, 'w', encoding='utf-8') as f:
                    json.dump(segments, f, ensure_ascii=False, indent=2)

                print(f"✅ Aliyun ASR: Transcribed {audio_file}", file=sys.stderr)
                print(f"   Generated {len(segments)} segments from smart text splitting", file=sys.stderr)
                print(f"   Text: {text}", file=sys.stderr)
                return True
            else:
                print(f"❌ No result in response: {result}", file=sys.stderr)
                return False
        else:
            print(f"❌ ASR failed: {asr_response.status_code}", file=sys.stderr)
            print(f"   Response: {asr_response.text[:500]}", file=sys.stderr)
            return False

    except Exception as e:
        print(f"❌ Aliyun ASR error: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return False

def main():
    if len(sys.argv) < 3:
        print("Usage: aliyun_asr_fixed.py <audio_file> <output_json> [language]", file=sys.stderr)
        sys.exit(1)

    audio_file = sys.argv[1]
    output_json = sys.argv[2]
    language = sys.argv[3] if len(sys.argv) > 3 else "zh"

    success = transcribe_audio(audio_file, output_json, language)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
