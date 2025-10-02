from rest_framework.views import APIView
from rest_framework.response import Response
import csv

METRICS_CSV_PATH = "data/metrics.csv"
METRICS_DATA = []

with open(METRICS_CSV_PATH, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        row['cost_micros'] = float(row['cost_micros']) if row['cost_micros'] else 0
        row['clicks'] = float(row['clicks']) if row['clicks'] else 0
        row['conversions'] = float(row['conversions']) if row['conversions'] else 0
        row['impressions'] = float(row['impressions']) if row['impressions'] else 0
        row['interactions'] = float(row['interactions']) if row['interactions'] else 0
        row['date'] = row['date']
        METRICS_DATA.append(row)


class MetricsView(APIView):
    PAGE_SIZE_DEFAULT = 20

    def get(self, request):
        role = request.GET.get("role", "user")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        sort_by = request.GET.get("sort_by")
        sort_order = request.GET.get("sort_order", "asc")
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", self.PAGE_SIZE_DEFAULT))

        filtered_data = METRICS_DATA.copy()

        if start_date:
            filtered_data = [d for d in filtered_data if d['date'] >= start_date]
        if end_date:
            filtered_data = [d for d in filtered_data if d['date'] <= end_date]

        if sort_by and sort_by in filtered_data[0]:
            descending = sort_order.lower() == "desc"
            filtered_data.sort(key=lambda x: x[sort_by], reverse=descending)

        if role != "admin":
            for d in filtered_data:
                d.pop('cost_micros', None)

        total = len(filtered_data)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        page_data = filtered_data[start_idx:end_idx]

        return Response({
            "page": page,
            "page_size": page_size,
            "total": total,
            "metrics": page_data
        })