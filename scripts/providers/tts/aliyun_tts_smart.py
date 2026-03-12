#!/usr/bin/env python3
"""
Aliyun TTS - Smart Voice Selection
智能语言检测和音色选择，避免 418 错误

解决问题：
1. 自动检测文本语言（中文/英文/混合）
2. 根据语言智能选择合适音色
3. 避免音色语言不匹配导致的 418 错误
4. 文本长度检查和分段支持
"""

import sys
import os
import re

# 导入原有的 TTS 函数
sys.path.insert(0, os.path.dirname(__file__))
from aliyun_tts_fixed import synthesize_speech, get_aliyun_token

def detect_language(text):
    """
    检测文本主要语言

    返回:
        'zh': 主要是中文
        'en': 主要是英文
        'mixed': 中英混合
    """
    # 统计中文字符（包括标点）
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))

    # 统计英文字母
    english_chars = len(re.findall(r'[a-zA-Z]', text))

    # 总字符数（去除空格和标点）
    total_content_chars = chinese_chars + english_chars

    if total_content_chars == 0:
        return 'zh'  # 默认中文

    # 计算比例
    chinese_ratio = chinese_chars / total_content_chars
    english_ratio = english_chars / total_content_chars

    # 判断逻辑
    if chinese_ratio >= 0.8:
        return 'zh'
    elif english_ratio >= 0.8:
        return 'en'
    else:
        return 'mixed'

def get_voice_info():
    """
    获取阿里云音色信息

    返回音色字典，包含语言支持信息
    """
    return {
        # 中文音色（仅支持中文）
        'zh_voices': {
            'Zhiqi': {'gender': 'female', 'description': '智琪 - 清晰标准（推荐）'},
            'Xiaoyun': {'gender': 'female', 'description': '小云 - 亲和力'},
            'Aibao': {'gender': 'male', 'description': '艾宝 - 男声通用'},
            'Aitong': {'gender': 'child', 'description': '艾彤 - 儿童音'},
            'Aixia': {'gender': 'female', 'description': '艾霞 - 粤语'},
            'Aishuo': {'gender': 'male', 'description': '艾硕 - 四川话'},
        },

        # 英文音色（仅支持英文）
        'en_voices': {
            'Catherine': {'gender': 'female', 'description': '凯瑟琳 - 标准美音（推荐）'},
            'Kenny': {'gender': 'male', 'description': '肯尼 - 标准美音'},
            'Rosa': {'gender': 'female', 'description': '罗莎 - 温柔'},
        },

        # 多语言音色（支持中英混合）
        'mixed_voices': {
            'Aida': {'gender': 'female', 'description': '艾达 - 中英混合（推荐）'},
        }
    }

def select_voice_for_language(language, preferred_voice=None, gender_preference=None):
    """
    根据语言选择合适的音色

    Args:
        language: 'zh', 'en', 'mixed'
        preferred_voice: 用户指定的音色（可选）
        gender_preference: 性别偏好 'male'/'female'（可选）

    Returns:
        选定的音色名称
    """
    voice_info = get_voice_info()

    # 检查用户指定的音色是否兼容
    if preferred_voice:
        # 检查音色在哪个类别
        for category, voices in voice_info.items():
            if preferred_voice in voices:
                # 检查兼容性
                if language == 'zh' and category == 'zh_voices':
                    return preferred_voice
                elif language == 'en' and category == 'en_voices':
                    return preferred_voice
                elif language == 'mixed' and category in ['zh_voices', 'mixed_voices']:
                    return preferred_voice
                else:
                    print(f"⚠️  Voice '{preferred_voice}' not compatible with {language} text", file=sys.stderr)
                    print(f"   Voice category: {category}, Text language: {language}", file=sys.stderr)
                    break

    # 自动选择音色
    if language == 'zh':
        # 中文：优先 Zhiqi
        if gender_preference == 'male':
            return 'Aibao'
        return 'Zhiqi'

    elif language == 'en':
        # 英文：优先 Catherine
        if gender_preference == 'male':
            return 'Kenny'
        return 'Catherine'

    else:  # mixed
        # 混合：使用 Aida
        return 'Aida'

def check_text_length(text, max_length=300):
    """
    检查文本长度是否超限

    Args:
        text: 文本内容
        max_length: 最大长度限制（默认 300）

    Returns:
        (is_valid, message)
    """
    text_length = len(text)

    if text_length <= max_length:
        return True, f"Text length OK: {text_length} chars"
    else:
        return False, f"Text too long: {text_length} chars (max {max_length})"

def synthesize_speech_smart(text, output_file, voice=None, speech_rate=0, auto_select=True):
    """
    智能 TTS：自动检测语言并选择音色

    Args:
        text: 文本内容
        output_file: 输出文件路径
        voice: 指定音色（可选）
        speech_rate: 语速 (-500 to 500)
        auto_select: 是否启用自动音色选择（默认 True）

    Returns:
        成功返回 True，失败返回 False
    """
    print(f"🎤 Aliyun TTS Smart Mode", file=sys.stderr)
    print(f"   Text length: {len(text)} chars", file=sys.stderr)

    # 1. 检测语言
    language = detect_language(text)
    language_names = {'zh': '中文', 'en': 'English', 'mixed': '中英混合'}
    print(f"🔍 Detected language: {language_names.get(language, language)}", file=sys.stderr)

    # 2. 检查文本长度
    is_valid, length_msg = check_text_length(text)
    if not is_valid:
        print(f"⚠️  {length_msg}", file=sys.stderr)
        print(f"   Hint: Consider splitting text into segments", file=sys.stderr)
        # 不直接返回失败，让 TTS API 处理（可能支持更长文本）

    # 3. 选择音色
    if auto_select:
        final_voice = select_voice_for_language(language, voice)
        if final_voice != voice:
            print(f"🎵 Auto-selected voice: {final_voice} (was: {voice or 'none'})", file=sys.stderr)
        else:
            print(f"🎵 Using voice: {final_voice}", file=sys.stderr)
    else:
        final_voice = voice or 'Zhiqi'
        print(f"🎵 Using specified voice: {final_voice}", file=sys.stderr)

    # 显示音色信息
    voice_info = get_voice_info()
    for category, voices in voice_info.items():
        if final_voice in voices:
            print(f"   {voices[final_voice]['description']}", file=sys.stderr)
            break

    # 4. 调用 TTS
    try:
        success = synthesize_speech(text, output_file, final_voice, speech_rate)

        if success:
            print(f"✅ TTS generation successful", file=sys.stderr)
        else:
            print(f"❌ TTS generation failed", file=sys.stderr)

            # 提供故障排除建议
            print(f"\n💡 Troubleshooting tips:", file=sys.stderr)
            if language == 'mixed':
                print(f"   - Try voice 'Aida' for mixed language text", file=sys.stderr)
            elif language == 'zh':
                print(f"   - For Chinese, try: Zhiqi, Xiaoyun, or Aibao", file=sys.stderr)
            elif language == 'en':
                print(f"   - For English, try: Catherine, Kenny, or Rosa", file=sys.stderr)

            print(f"   - Check text content for sensitive words", file=sys.stderr)
            print(f"   - Try splitting text if it's too long", file=sys.stderr)

        return success

    except Exception as e:
        print(f"❌ Exception: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return False

def main():
    """命令行入口"""
    if len(sys.argv) < 3:
        print("Usage: aliyun_tts_smart.py <text> <output_file> [voice] [speed] [--no-auto-select]", file=sys.stderr)
        print("", file=sys.stderr)
        print("Options:", file=sys.stderr)
        print("  --no-auto-select    Disable auto voice selection", file=sys.stderr)
        print("", file=sys.stderr)
        print("Examples:", file=sys.stderr)
        print("  # Auto-select voice based on language", file=sys.stderr)
        print("  python3 aliyun_tts_smart.py '你好世界' output.mp3", file=sys.stderr)
        print("", file=sys.stderr)
        print("  # Specify voice (will auto-switch if incompatible)", file=sys.stderr)
        print("  python3 aliyun_tts_smart.py 'Hello World' output.mp3 Aibao", file=sys.stderr)
        print("", file=sys.stderr)
        print("  # Disable auto-select", file=sys.stderr)
        print("  python3 aliyun_tts_smart.py 'Test' output.mp3 Zhiqi 0 --no-auto-select", file=sys.stderr)
        sys.exit(1)

    text = sys.argv[1]
    output_file = sys.argv[2]
    voice = sys.argv[3] if len(sys.argv) > 3 else None

    # 解析速度参数
    speed = 1.0
    auto_select = True

    for i in range(4, len(sys.argv)):
        arg = sys.argv[i]
        if arg == '--no-auto-select':
            auto_select = False
        else:
            try:
                speed = float(arg)
            except ValueError:
                pass

    # 转换速度格式
    speech_rate = int((speed - 1.0) * 500)
    speech_rate = max(-500, min(500, speech_rate))

    # 调用智能 TTS
    success = synthesize_speech_smart(text, output_file, voice, speech_rate, auto_select)

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
