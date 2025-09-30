import csv
from datetime import datetime
from pathlib import Path

CSV_FILE = Path(__file__).resolve().parent.parent / "data/metrics.csv"

def load_metrics(role="user", start_date=None, end_date=None, sort_by=None):
    results = []

    with open(CSV_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            row_date = datetime.strptime(row["date"], "%Y-%m-%d").date()

            if start_date and row_date < start_date:
                continue
            if end_date and row_date > end_date:
                continue

            if role != "admin":
                row.pop("cost_micros", None)

            results.append(row)

    if sort_by:
        try:
            results.sort(key=lambda x: float(x.get(sort_by, 0)) if x.get(sort_by) else x.get(sort_by))
        except ValueError:
            pass

    return results