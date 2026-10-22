#!/usr/bin/env python3
"""Concurrency check for exclusive ledger writes. PHP-FPM stress is not run here."""
import json
import os
import tempfile
import threading
import time

path = os.path.join(tempfile.gettempdir(), "clay-lock-test.json")
with open(path, "w") as fh:
    json.dump({"n": 0}, fh)


def bump():
    for _ in range(40):
        with open(path, "r+") as fh:
            # emulate flock via atomic rewrite under a lock file
            lock = open(path + ".lock", "a+")
            try:
                if os.name != "nt":
                    import fcntl
                    fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
                raw = fh.read() or "{}"
                data = json.loads(raw)
                data["n"] = int(data.get("n") or 0) + 1
                fh.seek(0)
                fh.truncate()
                json.dump(data, fh)
                fh.flush()
            finally:
                lock.close()


threads = [threading.Thread(target=bump) for _ in range(8)]
for t in threads:
    t.start()
for t in threads:
    t.join()
with open(path) as fh:
    n = json.load(fh)["n"]
print("expected", 8 * 40, "got", n)
os.remove(path)
try:
    os.remove(path + ".lock")
except OSError:
    pass
if n != 320:
    raise SystemExit(1)
