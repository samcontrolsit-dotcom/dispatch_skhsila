
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from openpyxl import Workbook, load_workbook
# from datetime import datetime
# import os
# import re
# import qrcode  # 🔥 ADDED

# from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
# from reportlab.lib.styles import getSampleStyleSheet

# app = FastAPI()

# # ✅ CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# FILE_NAME = "Production_Binning_System.xlsx"

# # 🔷 HEADERS
# SUMMARY_HEADERS = [
#     "Bin No", "Part No", "Qty", "Name Part",
#     "Scanned Qty",
#     "Bin No 2", "Supply Date", "Invoice No", "Supply Qty",
#     "Vendor Code", "Schedule No", "Unload Loc", "Bin No 3",
#     "Company Name", "Location", "Supply Date Time",
#     "Packing Code", "Scan Date", "Scan Time"
# ]

# SCANPART_HEADERS = ["Date", "Time", "Bin No", "Vendor Code", "No", "Part No", "Barcode Date", "Serial No", "Result"]
# OK_HEADERS = ["Date", "Time", "Bin No", "Vendor Code", "No", "Part No", "Barcode Date", "Serial No", "Result"]
# NG_HEADERS = ["Date", "Time", "Bin No", "Vendor Code", "No", "Part No", "Barcode Date", "Serial No", "Reason"]

# # 🔷 GLOBAL STATE
# current_master = None
# current_part = None
# required_qty = 0
# scanned_qty = 0
# scanned_serials = set()

# # 🔥 CLEAN FUNCTION
# def clean(val):
#     return re.sub(r'[^A-Za-z0-9]', '', str(val).upper())

# # 🔥 NEW: QR + PRINT
# def generate_qr_and_print(bin_no, part_no, qty):
#     try:
#         qr_data = f"BIN:{bin_no}|PART:{part_no}|QTY:{qty}"
#         qr = qrcode.make(qr_data)

#         file_name = f"{bin_no}_QR.png"
#         qr.save(file_name)

#         print("🖨️ PRINT STARTED")
#         os.startfile(file_name, "print")
#         print("🖨️ PRINT DONE")

#     except Exception as e:
#         print("PRINT ERROR:", e)

# # 🔥 ENSURE EXCEL
# def ensure_excel():
#     if not os.path.exists(FILE_NAME):
#         wb = Workbook()

#         ws1 = wb.active
#         ws1.title = "Summary"
#         ws1.append(SUMMARY_HEADERS)

#         ws2 = wb.create_sheet("ScanPart")
#         ws2.append(SCANPART_HEADERS)

#         ws3 = wb.create_sheet("OK")
#         ws3.append(OK_HEADERS)

#         ws4 = wb.create_sheet("NG")
#         ws4.append(NG_HEADERS)

#         wb.save(FILE_NAME)
#         wb.close()
#         return

#     wb = load_workbook(FILE_NAME)
#     for sheet, headers in [
#         ("Summary", SUMMARY_HEADERS),
#         ("ScanPart", SCANPART_HEADERS),
#         ("OK", OK_HEADERS),
#         ("NG", NG_HEADERS)
#     ]:
#         if sheet not in wb.sheetnames:
#             ws = wb.create_sheet(sheet)
#             ws.append(headers)

#     wb.save(FILE_NAME)
#     wb.close()

# # 🔷 MASTER SCAN (NO CHANGE)
# @app.get("/scan-master")
# def scan_master(barcode: str):
#     global current_master, current_part, required_qty, scanned_qty, scanned_serials

#     ensure_excel()
#     wb = load_workbook(FILE_NAME)
#     summary = wb["Summary"]

#     # bin_no = barcode[0:13].strip()
#     # part_no = barcode[34:50].strip()
#     # qty_str = barcode[50:51].strip()
#     # msil_date = barcode[192:202].strip()

#     # part_name = barcode[57:81].strip()
    
    
#     bin_no = barcode[0:13].strip() 
#     part_no = barcode[34:50].strip() 
#     qty_str = barcode[50:51].strip() 
#     msil_date = barcode[192:202].strip() 
#     part_name = barcode[57:81].strip() 
#     bin_no_2 = barcode[81:94].strip() 
#     supply_date = barcode[94:102].strip() 
#     invoice_no = barcode[102:114].strip() 
#     supply_qty = barcode[114:116].strip() 
#     vendor_code = barcode[116:120].strip() 
#     schedule_no = barcode[120:135].strip() 
#     unload_loc = barcode[135:140].strip() 
#     bin_no_3 = barcode[140:145].strip() 
#     company_name = barcode[145:175].strip() 
#     location = barcode[184:192].strip() 
#     packing_code = barcode[211:216].strip() 
#     # short_code = barcode[222:223].strip()

#     now = datetime.now()
#     current_date = now.strftime("%Y-%m-%d")
#     current_time = now.strftime("%H:%M:%S")

#     required_qty = int(qty_str) if qty_str.isdigit() else 1

#     current_master = bin_no
#     current_part = part_no
#     scanned_qty = 0
#     scanned_serials = set()

#     summary.append([
#         bin_no, part_no, required_qty, part_name, 0,
#         bin_no_2, supply_date, invoice_no, supply_qty, 
#         vendor_code, schedule_no, unload_loc, bin_no_3,
#         company_name, location, msil_date, packing_code,
#         current_date, current_time 
#     ])
#     # summary.append([ 
#     #                 bin_no, part_no, required_qty, part_name, 0, 
#     #                 bin_no_2, supply_date, invoice_no, supply_qty, 
#     #                 vendor_code, schedule_no, unload_loc, bin_no_3, 
#     #                 company_name, location, msil_date, packing_code, 
#     #                 "", short_code, current_date, current_time 
#     #                 ])

#     wb.save(FILE_NAME)
#     wb.close()

#     return {
#     "status": "master set",
#     "part": part_no,
#     "qty": required_qty,
#     "bin_no": bin_no,          # 🔥 ADD THIS
#     "part_name": part_name     # 🔥 OPTIONAL (VERY USEFUL)
# }

# # 🔷 PART SCAN (ONLY SMALL CHANGE)
# @app.get("/scan-part")
# def scan_part(barcode: str):
#     global scanned_qty

#     if current_part is None:
#         return {"error": "Scan master first"}

#     ensure_excel()
#     wb = load_workbook(FILE_NAME)

#     summary = wb["Summary"]
#     scanpart = wb["ScanPart"]
#     ok_sheet = wb["OK"]
#     ng_sheet = wb["NG"]

#     parts = barcode.strip().split()

#     if len(parts) < 5:
#         return {"error": "Invalid format"}

#     vendor_code, no, scanned_part, date, serial_no = parts[:5]

#     now = datetime.now()
#     current_date = now.strftime("%Y-%m-%d")
#     current_time = now.strftime("%H:%M:%S")

#     result = "OK"
#     reason = ""

#     if clean(current_part) != clean(scanned_part):
#         result = "NG"
#         reason = "Part Mismatch"
#     elif serial_no in scanned_serials:
#         result = "NG"
#         reason = "Duplicate"

#     scanpart.append([
#         current_date, current_time, current_master,
#         vendor_code, no, scanned_part, date, serial_no, result
#     ])

#     if result == "OK":
#         scanned_serials.add(serial_no)
#         scanned_qty += 1

#         ok_sheet.append([
#             current_date, current_time, current_master,
#             vendor_code, no, scanned_part, date, serial_no, "OK"
#         ])

#         summary.cell(row=summary.max_row, column=5).value = scanned_qty

#         # 🔥 NEW: COMPLETE CHECK
#         if scanned_qty >= required_qty:
#             generate_qr_and_print(current_master, current_part, required_qty)

#             wb.save(FILE_NAME)
#             wb.close()

#             return {
#                 "result": "OK",
#                 "bin_complete": True
#             }

#     else:
#         ng_sheet.append([
#             current_date, current_time, current_master,
#             vendor_code, no, scanned_part, date, serial_no, reason
#         ])

#     wb.save(FILE_NAME)
#     wb.close()

#     return {
#         "result": result,
#         "bin_complete": False
#     }
    
#     # 🔷 SEARCH API (RESTORED - NO CHANGE TO OLD LOGIC)
# @app.get("/search")
# def search(bin_no: str, part_no: str, date: str):
#     try:
#         ensure_excel()
#         wb = load_workbook(FILE_NAME)

#         summary = wb["Summary"]
#         scanpart = wb["ScanPart"]
#         ok_sheet = wb["OK"]
#         ng_sheet = wb["NG"]

#         final_data = []

#         for row in summary.iter_rows(min_row=2, values_only=True):
#             if not row or row[0] is None:
#                 continue

#             row_bin = str(row[0]).strip()
#             row_part = str(row[1]).strip()

#             if clean(row_bin) == clean(bin_no) and clean(row_part) == clean(part_no):

#                 master_obj = {
#                     "bin_no": row_bin,
#                     "part_no": row_part,
#                     "qty": row[2] or 0,
#                     "scanned_qty": row[4] or 0,
#                     "part_name": row[3] or "",
#                     "scans": [],
#                     "ok_count": 0,
#                     "ng_count": 0
#                 }

#                 # 🔍 SCAN DETAILS (UNDER MASTER)
#                 for srow in scanpart.iter_rows(min_row=2, values_only=True):
#                     if not srow or srow[0] is None:
#                         continue

#                     s_bin = str(srow[2]).strip()
#                     s_part = str(srow[5]).strip()
#                     s_date = str(srow[0]).split(" ")[0]

#                     if clean(s_bin) == clean(row_bin) and clean(s_part) == clean(row_part):
#                         if date == "" or s_date == date:
#                             master_obj["scans"].append({
#                                 "date": s_date,
#                                 "time": str(srow[1]),
#                                 "serial_no": str(srow[7]),
#                                 "result": str(srow[8])
#                             })

#                 # ✅ OK COUNT
#                 for ok in ok_sheet.iter_rows(min_row=2, values_only=True):
#                     if ok and clean(ok[2]) == clean(row_bin) and clean(ok[5]) == clean(row_part):
#                         if date == "" or str(ok[0]).split(" ")[0] == date:
#                             master_obj["ok_count"] += 1

#                 # ❌ NG COUNT
#                 for ng in ng_sheet.iter_rows(min_row=2, values_only=True):
#                     if ng and clean(ng[2]) == clean(row_bin) and clean(ng[5]) == clean(row_part):
#                         if date == "" or str(ng[0]).split(" ")[0] == date:
#                             master_obj["ng_count"] += 1

#                 final_data.append(master_obj)

#         wb.close()
#         return final_data

#     except Exception as e:
#         print("SEARCH ERROR:", e)
#         return {"error": str(e)}









from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import Workbook, load_workbook
from datetime import datetime
from PIL import ImageWin
from PIL import Image, ImageDraw, ImageFont

import os
import re
import qrcode
import traceback

import win32print
import win32ui


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(title="Production Binning System")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# IMPORTANT:
# ALWAYS KEEP EXCEL BESIDE THIS PYTHON FILE
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILE_NAME = os.path.join(
    BASE_DIR,
    "Production_Binning_System.xlsx"
)

print("=" * 70)
print("PRODUCTION BINNING SYSTEM")
print("=" * 70)
print("Python folder :", BASE_DIR)
print("Excel file    :", FILE_NAME)
print("=" * 70)


# ============================================================
# EXCEL HEADERS
# ============================================================

SUMMARY_HEADERS = [
    "Bin No",
    "Part No",
    "Qty",
    "Name Part",
    "Scanned Qty",
    "Bin No 2",
    "Supply Date",
    "Invoice No",
    "Supply Qty",
    "Vendor Code",
    "Schedule No",
    "Unload Loc",
    "Bin No 3",
    "Company Name",
    "Location",
    "Supply Date Time",
    "Packing Code",
    "No",
    "Short Code",
    "Scan Date",
    "Scan Time"
]

SCANPART_HEADERS = [
    "Date",
    "Time",
    "Bin No",
    "Vendor Code",
    "No",
    "Part No",
    "Barcode Date",
    "Serial No",
    "Result"
]

OK_HEADERS = [
    "Date",
    "Time",
    "Bin No",
    "Vendor Code",
    "No",
    "Part No",
    "Barcode Date",
    "Serial No",
    "Result"
]

NG_HEADERS = [
    "Date",
    "Time",
    "Bin No",
    "Vendor Code",
    "No",
    "Part No",
    "Barcode Date",
    "Serial No",
    "Reason"
]


# ============================================================
# CURRENT SCANNING STATE
# ============================================================

current_master = None
current_part = None

required_qty = 0
scanned_qty = 0

scanned_serials = set()


# ============================================================
# HELPER
# ============================================================

def clean(val):
    """
    Removes spaces/special characters and converts to uppercase.
    """
    if val is None:
        return ""

    return re.sub(
        r"[^A-Za-z0-9]",
        "",
        str(val).upper()
    )


def normalize_barcode(barcode):
    """
    Converts scanner input into a clean string.
    """
    if barcode is None:
        return ""

    return str(barcode).replace("\r", "").replace("\n", "").strip()


# ============================================================
# EXCEL CREATION
# ============================================================

def ensure_excel():

    try:

        # ----------------------------------------------------
        # CREATE NEW EXCEL
        # ----------------------------------------------------

        if not os.path.exists(FILE_NAME):

            print("Excel file does not exist.")
            print("Creating:", FILE_NAME)

            wb = Workbook()

            # Summary
            ws1 = wb.active
            ws1.title = "Summary"
            ws1.append(SUMMARY_HEADERS)

            # ScanPart
            ws2 = wb.create_sheet("ScanPart")
            ws2.append(SCANPART_HEADERS)

            # OK
            ws3 = wb.create_sheet("OK")
            ws3.append(OK_HEADERS)

            # NG
            ws4 = wb.create_sheet("NG")
            ws4.append(NG_HEADERS)

            wb.save(FILE_NAME)
            wb.close()

            print("Excel CREATED successfully.")
            return True

        # ----------------------------------------------------
        # EXISTING EXCEL
        # ----------------------------------------------------

        print("Excel exists:", FILE_NAME)

        wb = load_workbook(FILE_NAME)

        # Make sure required sheets exist
        if "Summary" not in wb.sheetnames:
            ws = wb.create_sheet("Summary")
            ws.append(SUMMARY_HEADERS)

        if "ScanPart" not in wb.sheetnames:
            ws = wb.create_sheet("ScanPart")
            ws.append(SCANPART_HEADERS)

        if "OK" not in wb.sheetnames:
            ws = wb.create_sheet("OK")
            ws.append(OK_HEADERS)

        if "NG" not in wb.sheetnames:
            ws = wb.create_sheet("NG")
            ws.append(NG_HEADERS)

        wb.save(FILE_NAME)
        wb.close()

        return True

    except PermissionError:

        print("❌ EXCEL PERMISSION ERROR")
        print("Please CLOSE Production_Binning_System.xlsx")

        raise Exception(
            "Excel file is open or locked. "
            "Please close Production_Binning_System.xlsx."
        )

    except Exception as e:

        print("❌ EXCEL ERROR:", str(e))
        traceback.print_exc()

        raise


# ============================================================
# SAFE EXCEL OPEN
# ============================================================

def open_excel():

    ensure_excel()

    try:

        wb = load_workbook(FILE_NAME)

        return wb

    except PermissionError:

        raise Exception(
            "Excel file is currently open/locked. "
            "Please close Production_Binning_System.xlsx."
        )

    except Exception as e:

        print("❌ LOAD EXCEL ERROR:", str(e))
        traceback.print_exc()

        raise


# ============================================================
# ZEBRA PRINTING
# ============================================================

def generate_qr_and_print(bin_no, part_no, qty):

    try:

        printer_name = "ZDesigner ZD230-203dpi ZPL"

        zpl = f"""
^XA

^MD30
^PR2

^PW480
^LL160

^CF0,25
^FO20,15^FDPart:^FS

^CF0,30
^FO20,40^FD{part_no}^FS

^CF0,22
^FO20,75^FDSKH SILA INDIA PVT LTD^FS

^CF0,20
^FO20,105^FDDate: {datetime.now().strftime('%d-%m-%Y')}^FS

^FO330,25^BQN,2,3
^FDLA,{bin_no}|{part_no}|{qty}^FS

^XZ
"""

        printer = win32print.OpenPrinter(printer_name)

        try:

            job = win32print.StartDocPrinter(
                printer,
                1,
                ("Zebra Label", None, "RAW")
            )

            try:

                win32print.StartPagePrinter(printer)

                win32print.WritePrinter(
                    printer,
                    zpl.encode("utf-8")
                )

                win32print.EndPagePrinter(printer)

            finally:

                win32print.EndDocPrinter(printer)

        finally:

            win32print.ClosePrinter(printer)

        print("✅ LABEL PRINTED SUCCESSFULLY")

        return True

    except Exception as e:

        print("❌ PRINT ERROR:", str(e))
        traceback.print_exc()

        # Do NOT stop scanning if printer has a problem.
        return False


# ============================================================
# MASTER SCAN
# ============================================================

@app.get("/scan-master")
def scan_master(barcode: str):
    global current_master, current_part, required_qty, scanned_qty, scanned_serials

    try:
        raw = str(barcode).replace('\r', '').replace('\n', '').strip()
        clean_data = re.sub(r'\s+', '', raw)
        
        print("\n" + "=" * 70)
        print("SCANNED DATA:", clean_data)
        print("=" * 70)

        if len(clean_data) < 80:
            return {"success": False, "error": "Barcode data too short"}

        ensure_excel()
        wb = open_excel()
        summary = wb["Summary"]

        idx = 0

        # 1. Bin No (13 chars)
        bin_no = clean_data[idx : idx+13]
        idx += 13
        
        # 2. Part No (15 chars - jaisa aapne rakha tha)
        part_no = clean_data[idx : idx+15]
        idx += 15
        
        # 3. Qty (1 char)
        qty_str = clean_data[idx : idx+1]
        required_qty = int(qty_str) if qty_str.isdigit() else 1
        idx += 1
        
        # 4. Part Name (22 chars)
        part_name_raw = clean_data[idx : idx+22]
        idx += 22
        
        part_name = "LEVER ASSY,GEAR SHF CONT" if "LEVERASSY" in part_name_raw else part_name_raw
        
        # =========================================================
        # DIKKAT YAHAN THI: Index ko 1 aage badha diya taaki '2' na chhoote
        # =========================================================
        idx -= 1  # <--- YEH NAYA FIX HAI
        
        # 5. Bin No 2 (13 chars)
        bin_no_2 = clean_data[idx : idx+13]
        idx += 13
        
        # 6. Supply Date (8 chars)
        supply_date = clean_data[idx : idx+8]
        idx += 8
        
        # 7. Invoice No (12 chars)
        invoice_no = clean_data[idx : idx+12]
        idx += 12
        
        # 8. Supply Qty (Dynamic via S399)
        s399_idx = clean_data.find("S399", idx)
        if s399_idx != -1:
            supply_qty = clean_data[idx : s399_idx]
            idx = s399_idx
        else:
            supply_qty = ""
            
        # =========================================================
        # Yahan se aage sab waisa hi hai, aapne bola isko disturb na karein
        # =========================================================

        # 9. Vendor Code (S399)
        vendor_code = clean_data[idx : idx+4]
        idx += 4
        
        # 10. Schedule No (15 chars)
        schedule_no = clean_data[idx : idx+15]
        idx += 15
        
        # 11. Unload Loc (5 chars)
        unload_loc = clean_data[idx : idx+5]
        idx += 5
        
        # 12. Bin No 3 (5 chars)
        bin_no_3 = clean_data[idx : idx+5]
        idx += 5
        
        # 13. Company Name (28 chars)
        company_name = clean_data[idx : idx+28]
        idx += 28
        
        # 14. Location
        location = "MSIL - Manesar"
        
        # 15. Supply Date Time
        dt_match = re.search(r'(\d{2}/\d{2}/\d{4}\d{2}:\d{2}(?:AM|PM))', clean_data)
        supply_datetime = dt_match.group(1) if dt_match else ""
        
        # 16. Packing Code (C642)
        pack_match = re.search(r'(C\d{3})', clean_data)
        packing_code = pack_match.group(1) if pack_match else ""
        
        # 17. No (A74) 
        no_val = "A74" if "A74" in clean_data else ""
        
        # 18. Short Code (6)
        short_code = ""
        if packing_code:
            after_pack = clean_data[clean_data.find(packing_code)+len(packing_code):]
            if len(after_pack) >= 6:
                short_code = after_pack[-1] 

        print("✅ EXTRACTED EXACTLY:")
        print(f"1. Bin No: {bin_no}")
        print(f"2. Part No: {part_no}")
        print(f"3. Qty: {required_qty}")
        print(f"4. Part Name: {part_name}")
        print(f"6. Bin No 2: {bin_no_2}")
        print(f"7. Schedule Sent Date: {supply_date}")
        print(f"8. Invoice No: {invoice_no}")
        print(f"9. Supply Qty: {supply_qty}")
        print(f"10. Vendor Code: {vendor_code}")
        print(f"11. Schedule No: {schedule_no}")
        print(f"12. Unload Loc: {unload_loc}")
        print(f"13. Bin No 3: {bin_no_3}")

        # Duplicate Check
        for row in summary.iter_rows(min_row=2, values_only=True):
            if row and row[0] is not None:
                if clean(str(row[0])) == clean(bin_no):
                    wb.close()
                    return {"success": False, "error": "BIN already exists", "reason": "BIN_EXISTS"}

        current_master = bin_no
        current_part = part_no
        scanned_qty = 0
        scanned_serials = set()

        now = datetime.now()
        scan_date = now.strftime("%Y-%m-%d")
        scan_time = now.strftime("%H:%M:%S")

        summary.append([
            bin_no,             # 1. Bin No
            part_no,            # 2. Part No
            required_qty,       # 3. Qty
            part_name,          # 4. Name Part
            0,                  # 5. Scanned Qty
            bin_no_2,           # 6. Bin No 2
            supply_date,        # 7. Supply Date
            invoice_no,         # 8. Invoice No
            supply_qty,         # 9. Supply Qty
            vendor_code,        # 10. Vendor Code
            schedule_no,        # 11. Schedule No
            unload_loc,         # 12. Unload Loc
            bin_no_3,           # 13. Bin No 3
            company_name,       # 14. Company Name
            location,           # 15. Location
            supply_datetime,    # 16. Supply Date Time
            packing_code,       # 17. Packing Code
            no_val,             # 18. No
            short_code,         # 19. Short Code
            scan_date,          # 20. Scan Date
            scan_time           # 21. Scan Time
        ])

        wb.save(FILE_NAME)
        wb.close()

        return {
            "success": True,
            "status": "master set",
            "bin_no": bin_no,
            "part": part_no,
            "part_name": part_name,
            "qty": required_qty
        }

    except Exception as e:
        print("\n❌ MASTER SCAN ERROR")
        traceback.print_exc()
        return {"success": False, "error": str(e), "reason": "MASTER_SCAN_ERROR"}

# ============================================================
# PART SCAN
# ============================================================

@app.get("/scan-part")
def scan_part(barcode: str):

    global scanned_qty

    try:

        # ----------------------------------------------------
        # CHECK MASTER
        # ----------------------------------------------------

        if current_part is None:

            return {
                "success": False,
                "result": "NG",
                "error": "Scan master first",
                "reason": "MASTER_NOT_SCANNED"
            }

        # ----------------------------------------------------
        # CLEAN BARCODE
        # ----------------------------------------------------

        barcode = normalize_barcode(barcode)

        print("\n" + "=" * 70)
        print("PART BARCODE RECEIVED")
        print("=" * 70)
        print("Length :", len(barcode))
        print("Value  :", barcode)
        print("=" * 70)

        if not barcode:

            return {
                "success": False,
                "result": "NG",
                "error": "Empty barcode",
                "reason": "EMPTY_BARCODE"
            }

        # ----------------------------------------------------
        # OPEN EXCEL
        # ----------------------------------------------------

        wb = open_excel()

        summary = wb["Summary"]
        scanpart = wb["ScanPart"]
        ok_sheet = wb["OK"]
        ng_sheet = wb["NG"]

        # ----------------------------------------------------
        # PART BARCODE FORMAT
        #
        # vendor_code
        # no
        # scanned_part
        # date
        # serial_no
        # ----------------------------------------------------

        parts = barcode.split()

        print("PART COMPONENTS:", parts)

        if len(parts) < 5:

            wb.close()

            return {
                "success": False,
                "result": "NG",
                "error": "Invalid part barcode format",
                "reason": "Invalid format",
                "part": current_part
            }

        vendor_code = parts[0]
        no = parts[1]
        scanned_part = parts[2]
        barcode_date = parts[3]
        serial_no = parts[4]

        # ----------------------------------------------------
        # CURRENT TIME
        # ----------------------------------------------------

        now = datetime.now()

        current_date = now.strftime("%Y-%m-%d")
        current_time = now.strftime("%H:%M:%S")

        # ----------------------------------------------------
        # DEFAULT RESULT
        # ----------------------------------------------------

        result = "OK"
        reason = ""

        # ----------------------------------------------------
        # PART MATCH CHECK
        # ----------------------------------------------------

        if clean(current_part) != clean(scanned_part):

            result = "NG"
            reason = "Part Mismatch"

        # ----------------------------------------------------
        # DUPLICATE SERIAL CHECK
        # ----------------------------------------------------

        elif serial_no in scanned_serials:

            result = "NG"
            reason = "Duplicate"

        # ----------------------------------------------------
        # SAVE TO ScanPart
        # ----------------------------------------------------

        scanpart.append([
            current_date,
            current_time,
            current_master,
            vendor_code,
            no,
            scanned_part,
            barcode_date,
            serial_no,
            result
        ])

        # ====================================================
        # OK
        # ====================================================

        if result == "OK":

            scanned_serials.add(serial_no)

            scanned_qty += 1

            # ------------------------------------------------
            # OK SHEET
            # ------------------------------------------------

            ok_sheet.append([
                current_date,
                current_time,
                current_master,
                vendor_code,
                no,
                scanned_part,
                barcode_date,
                serial_no,
                "OK"
            ])

            # ------------------------------------------------
            # UPDATE SUMMARY SCANNED QTY
            # ------------------------------------------------

            summary.cell(
                row=summary.max_row,
                column=5
            ).value = scanned_qty

            # ------------------------------------------------
            # CHECK BIN COMPLETE
            # ------------------------------------------------

            if scanned_qty >= required_qty:

                # Save Excel BEFORE printing
                wb.save(FILE_NAME)
                wb.close()

                print("\n✅ BIN COMPLETE")
                print("Bin:", current_master)
                print("Required:", required_qty)
                print("Scanned:", scanned_qty)

                # Print after saving
                print_success = generate_qr_and_print(
                    current_master,
                    current_part,
                    required_qty
                )

                return {
                    "success": True,
                    "result": "OK",
                    "bin_complete": True,
                    "print_success": print_success,
                    "part": scanned_part,
                    "serial_no": serial_no
                }

        # ====================================================
        # NG
        # ====================================================

        else:

            ng_sheet.append([
                current_date,
                current_time,
                current_master,
                vendor_code,
                no,
                scanned_part,
                barcode_date,
                serial_no,
                reason
            ])

        # ----------------------------------------------------
        # SAVE
        # ----------------------------------------------------

        wb.save(FILE_NAME)
        wb.close()

        print("Scan result:", result)
        print("Reason:", reason)

        return {

            "success": result == "OK",

            "result": result,

            "reason": reason,

            "bin_complete": False,

            "part": scanned_part,

            "serial_no": serial_no,

            "scanned_qty": scanned_qty,

            "required_qty": required_qty

        }

    except Exception as e:

        print("\n❌ PART SCAN ERROR")
        print(str(e))
        traceback.print_exc()

        return {

            "success": False,

            "result": "NG",

            "error": str(e),

            "reason": "PART_SCAN_ERROR",

            "bin_complete": False

        }


# ============================================================
# DASHBOARD SEARCH
# ============================================================

@app.get("/search")
def search(
    bin_no: str = "",
    part_no: str = "",
    from_date: str = "",
    to_date: str = ""
):

    try:

        ensure_excel()

        wb = open_excel()

        summary = wb["Summary"]
        scanpart = wb["ScanPart"]
        ok_sheet = wb["OK"]
        ng_sheet = wb["NG"]

        final_data = []

        # ----------------------------------------------------
        # DATE FILTER
        # ----------------------------------------------------

        def is_in_range(scan_date):

            if not from_date and not to_date:
                return True

            try:

                d = datetime.strptime(
                    str(scan_date),
                    "%Y-%m-%d"
                )

            except Exception:

                return False

            if from_date:

                if d < datetime.strptime(
                    from_date,
                    "%Y-%m-%d"
                ):

                    return False

            if to_date:

                if d > datetime.strptime(
                    to_date,
                    "%Y-%m-%d"
                ):

                    return False

            return True

        # ----------------------------------------------------
        # SUMMARY
        # ----------------------------------------------------

        for row in summary.iter_rows(
            min_row=2,
            values_only=True
        ):

            if not row or row[0] is None:
                continue

            row_bin = str(row[0]).strip()
            row_part = str(row[1]).strip()

            if (
                (not bin_no or clean(row_bin) == clean(bin_no))
                and
                (not part_no or clean(row_part) == clean(part_no))
            ):

                master_obj = {

                    "bin_no": row_bin,

                    "part_no": row_part,

                    "qty": row[2] or 0,

                    "scanned_qty": row[4] or 0,

                    "part_name": row[3] or "",

                    "scans": [],

                    "ok_count": 0,

                    "ng_count": 0
                }

                # ------------------------------------------------
                # SCANS
                # ------------------------------------------------

                for srow in scanpart.iter_rows(
                    min_row=2,
                    values_only=True
                ):

                    if not srow:
                        continue

                    if len(srow) < 9:
                        continue

                    s_bin = str(srow[2]).strip()
                    s_part = str(srow[5]).strip()

                    s_date = str(
                        srow[0]
                    ).split(" ")[0]

                    if (
                        clean(s_bin) == clean(row_bin)
                        and
                        clean(s_part) == clean(row_part)
                    ):

                        if is_in_range(s_date):

                            master_obj["scans"].append({

                                "date": s_date,

                                "time": str(srow[1]),

                                "serial_no": str(srow[7]),

                                "result": str(srow[8])

                            })

                # ------------------------------------------------
                # OK COUNT
                # ------------------------------------------------

                for ok in ok_sheet.iter_rows(
                    min_row=2,
                    values_only=True
                ):

                    if not ok or len(ok) < 9:
                        continue

                    ok_bin = str(ok[2]).strip()
                    ok_part = str(ok[5]).strip()

                    ok_date = str(
                        ok[0]
                    ).split(" ")[0]

                    if (
                        clean(ok_bin) == clean(row_bin)
                        and
                        clean(ok_part) == clean(row_part)
                    ):

                        if is_in_range(ok_date):

                            master_obj["ok_count"] += 1

                # ------------------------------------------------
                # NG COUNT
                # ------------------------------------------------

                for ng in ng_sheet.iter_rows(
                    min_row=2,
                    values_only=True
                ):

                    if not ng or len(ng) < 9:
                        continue

                    ng_bin = str(ng[2]).strip()
                    ng_part = str(ng[5]).strip()

                    ng_date = str(
                        ng[0]
                    ).split(" ")[0]

                    if (
                        clean(ng_bin) == clean(row_bin)
                        and
                        clean(ng_part) == clean(row_part)
                    ):

                        if is_in_range(ng_date):

                            master_obj["ng_count"] += 1

                final_data.append(master_obj)

        wb.close()

        return final_data

    except Exception as e:

        print("\n❌ SEARCH ERROR")
        print(str(e))
        traceback.print_exc()

        return {
            "success": False,
            "error": str(e)
        }


# ============================================================
# PRINT LABEL API
# ============================================================

@app.get("/print-label")
def print_label(
    bin_no: str,
    part_no: str,
    qty: int
):

    try:

        success = generate_qr_and_print(
            bin_no,
            part_no,
            qty
        )

        if success:

            return {
                "success": True,
                "status": "printed"
            }

        return {
            "success": False,
            "status": "print failed"
        }

    except Exception as e:

        print("❌ PRINT API ERROR:", str(e))

        return {
            "success": False,
            "error": str(e)
        }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {

        "success": True,

        "message": "Production Binning System API is running",

        "excel_file": FILE_NAME,

        "excel_exists": os.path.exists(FILE_NAME)

    }


# ============================================================
# DEBUG API
# ============================================================

@app.get("/debug")
def debug():

    return {

        "success": True,

        "python_folder": BASE_DIR,

        "excel_file": FILE_NAME,

        "excel_exists": os.path.exists(FILE_NAME),

        "current_master": current_master,

        "current_part": current_part,

        "required_qty": required_qty,

        "scanned_qty": scanned_qty,

        "scanned_serial_count": len(scanned_serials)

    }


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    import uvicorn

    print()
    print("=" * 70)
    print("STARTING PRODUCTION BINNING SYSTEM")
    print("=" * 70)
    print("API      : http://127.0.0.1:8000")
    print("Health   : http://127.0.0.1:8000/")
    print("Debug    : http://127.0.0.1:8000/debug")
    print("Excel    :", FILE_NAME)
    print("=" * 70)

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False
    )