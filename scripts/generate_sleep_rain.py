#!/usr/bin/env python3
"""Generate copyright-free, steady rain beds for background HTML audio."""
import math
import os
import random
import struct
import wave

RATE = 11025
DURATION_SECONDS = 60
TAIL_SECONDS = 2

MODES = {
    "soft-rain": (0.16, 0.48, 0.82, 1101),
    "window-rain": (0.20, 0.58, 0.72, 2203),
    "rain-curtain": (0.25, 0.72, 0.58, 3307),
}


def generate(path, mix):
    white_mix, fast_mix, slow_mix, seed = mix
    rng = random.Random(seed)
    fast = slow = 0.0
    first = []
    tail_frames = RATE * TAIL_SECONDS
    total = RATE * DURATION_SECONDS
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(1)
        wav.setframerate(RATE)
        chunk = bytearray()
        for index in range(total):
            white = rng.random() * 2.0 - 1.0
            fast = fast * 0.67 + white * 0.33
            slow = slow * 0.976 + white * 0.024
            value = white * white_mix + fast * fast_mix + slow * slow_mix
            value = math.tanh(value * 1.18) * 0.56
            if index < tail_frames:
                first.append(value)
            if index >= total - tail_frames:
                position = index - (total - tail_frames)
                blend = position / float(tail_frames - 1)
                target = first[tail_frames - 1 - position]
                value = value * (1.0 - blend) + target * blend
            sample = max(0, min(255, int(value * 127 + 128)))
            chunk.extend(struct.pack("B", sample))
            if len(chunk) >= 32768:
                wav.writeframesraw(chunk)
                chunk.clear()
        if chunk:
            wav.writeframesraw(chunk)


if __name__ == "__main__":
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist", "audio"))
    for name, values in MODES.items():
        output = os.path.join(root, name + ".wav")
        print("generating", output)
        generate(output, values)
