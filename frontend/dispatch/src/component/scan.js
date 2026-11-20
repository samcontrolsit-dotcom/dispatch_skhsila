

// python3 -m uvicorn app:app --reload 


// import React, { useState, useRef, useEffect } from "react";
// import "../App.css";
// import logo from "../images/logo.png";
// import images from "../images/machine.png";

// function App() {

//     // =====================================================
//     // EXISTING STATES - KEPT
//     // =====================================================

//     const [status, setStatus] = useState("SCAN");
//     const [masterData, setMasterData] = useState(null);
//     const [scans, setScans] = useState([]);
//     const [alertMsg, setAlertMsg] = useState("");

//     // =====================================================
//     // EXISTING COUNTS - KEPT
//     // =====================================================

//     const scannedCount = scans.filter(
//         (s) => s.result === "OK"
//     ).length;

//     const ngCount = scans.filter(
//         (s) => s.result === "NG"
//     ).length;

//     const remainingQty = masterData
//         ? masterData.qty - scannedCount
//         : 0;

//     // =====================================================
//     // REFS
//     // =====================================================

//     const inputRef = useRef(null);
//     const scanBoxRef = useRef(null);

//     // Timer used to detect end of scanner input
//     const scanTimerRef = useRef(null);

//     // Prevent two scans from processing together
//     const processingRef = useRef(false);

//     // =====================================================
//     // INITIAL FOCUS
//     // =====================================================

//     useEffect(() => {

//         if (inputRef.current) {
//             inputRef.current.focus();
//         }

//     }, []);

//     // =====================================================
//     // KEEP SCANNER INPUT FOCUSED
//     // =====================================================

//     useEffect(() => {

//         const focusScanner = () => {

//             if (
//                 inputRef.current &&
//                 !processingRef.current
//             ) {

//                 inputRef.current.focus();

//             }

//         };

//         window.addEventListener(
//             "click",
//             focusScanner
//         );

//         return () => {

//             window.removeEventListener(
//                 "click",
//                 focusScanner
//             );

//         };

//     }, []);

//     // =====================================================
//     // FOCUS FUNCTION
//     // =====================================================

//     const focusInput = () => {

//         setTimeout(() => {

//             if (inputRef.current) {

//                 inputRef.current.focus();

//             }

//         }, 100);

//     };

//     // =====================================================
//     // ALERT FUNCTION
//     // =====================================================

//     const showAlert = (
//         message,
//         duration = 2000
//     ) => {

//         setAlertMsg(message);

//         setTimeout(() => {

//             setAlertMsg("");

//         }, duration);

//     };

//     // =====================================================
//     // SCANNER INPUT
//     //
//     // IMPORTANT:
//     //
//     // Your MSIL scanner sends:
//     //
//     // 2090782072034
//     // 28100M75T80-C48
//     // 2
//     // LEVER ASSY,GEAR SHF CONT
//     // ...
//     //
//     // Therefore we DO NOT process Enter.
//     //
//     // We wait until scanner stops sending data.
//     // =====================================================

//     const handleScannerInput = (e) => {

//         const value = e.target.value;

//         console.log(
//             "Scanner input received:",
//             JSON.stringify(value)
//         );

//         // =================================================
//         // START SCANNING ANIMATION
//         // =================================================

//         if (value.length > 0) {

//             if (scanBoxRef.current) {

//                 scanBoxRef.current.classList.add(
//                     "active"
//                 );

//             }

//             // Keep your original status logic:
//             // SCANNING only before master
//             if (!masterData) {

//                 setStatus("SCANNING");

//             }

//         }

//         // =================================================
//         // CLEAR PREVIOUS TIMER
//         // =================================================

//         clearTimeout(
//             scanTimerRef.current
//         );

//         // =================================================
//         // WAIT FOR COMPLETE BARCODE
//         // =================================================

//         scanTimerRef.current = setTimeout(() => {

//             const completeBarcode =
//                 value.trim();

//             console.log(
//                 "======================================"
//             );

//             console.log(
//                 "SCANNER FINISHED"
//             );

//             console.log(
//                 "COMPLETE BARCODE:"
//             );

//             console.log(
//                 completeBarcode
//             );

//             console.log(
//                 "BARCODE LENGTH:",
//                 completeBarcode.length
//             );

//             console.log(
//                 "======================================"
//             );

//             // Don't process empty input
//             if (
//                 completeBarcode.length === 0
//             ) {

//                 if (inputRef.current) {

//                     inputRef.current.value = "";

//                 }

//                 if (scanBoxRef.current) {

//                     scanBoxRef.current.classList.remove(
//                         "active"
//                     );

//                 }

//                 focusInput();

//                 return;

//             }

//             // Process complete barcode
//             processScan(
//                 completeBarcode
//             );

//         }, 500);

//     };

//     // =====================================================
//     // KEYDOWN
//     //
//     // We only prevent Enter from submitting early.
//     //
//     // We DO NOT use Enter to process barcode.
//     // =====================================================

//     const handleKeyDown = (e) => {

//         if (e.key === "Enter") {

//             e.preventDefault();

//         }

//     };

//     // =====================================================
//     // MAIN SCAN FUNCTION
//     //
//     // YOUR EXISTING LOGIC IS PRESERVED
//     // =====================================================

//     const processScan = async (value) => {

//         // Prevent duplicate processing
//         if (processingRef.current) {

//             return;

//         }

//         processingRef.current = true;

//         try {

//             // =================================================
//             // CLEAN BARCODE
//             //
//             // IMPORTANT:
//             // Keep newline structure.
//             // Only remove \r generated by Windows/scanner.
//             // =================================================

//             const barcode =
//                 value
//                     .replace(/\r/g, "")
//                     .trim();

//             console.log(
//                 "Sending COMPLETE barcode to Python:"
//             );

//             console.log(
//                 barcode
//             );

//             console.log(
//                 "Length:",
//                 barcode.length
//             );

//             // =================================================
//             // API URL
//             // =================================================

//             let url = "";

//             // =================================================
//             // MASTER SCAN
//             // =================================================

//             if (!masterData) {

//                 url =
//                     `http://127.0.0.1:8000/scan-master?barcode=${encodeURIComponent(
//                         barcode
//                     )}`;

//             }

//             // =================================================
//             // PART SCAN
//             // =================================================

//             else {

//                 url =
//                     `http://127.0.0.1:8000/scan-part?barcode=${encodeURIComponent(
//                         barcode
//                     )}`;

//             }

//             console.log(
//                 "API:",
//                 url
//             );

//             // =================================================
//             // SEND TO PYTHON
//             // =================================================

//             const res =
//                 await fetch(url);

//             const data =
//                 await res.json();

//             console.log(
//                 "Python Response:",
//                 data
//             );

//             // =================================================
//             // MASTER SCAN
//             // =================================================

//             if (!masterData) {

//                 // =================================================
//                 // BIN EXISTS ALERT
//                 // =================================================

//                 if (
//                     data.error ===
//                     "BIN already exists"
//                 ) {

//                     setAlertMsg(
//                         "⚠️ BIN already scanned!"
//                     );

//                     setTimeout(() => {

//                         window.location.reload();

//                     }, 3000);

//                     return;

//                 }

//                 // =================================================
//                 // INVALID MASTER BARCODE
//                 // =================================================

//                 if (
//                     data.success === false
//                 ) {

//                     setStatus("NG");

//                     setAlertMsg(
//                         data.error ||
//                         "❌ Invalid Master Barcode"
//                     );

//                     setTimeout(() => {

//                         setAlertMsg("");

//                         setStatus("SCAN");

//                     }, 2500);

//                     return;

//                 }

//                 // =================================================
//                 // MASTER SUCCESS
//                 // =================================================

//                 setMasterData(data);

//                 setStatus(
//                     "MASTER_SET"
//                 );

//                 setTimeout(() => {

//                     setStatus(
//                         "SCAN_PART"
//                     );

//                     focusInput();

//                 }, 2000);

//             }

//             // =================================================
//             // PART SCAN
//             // =================================================

//             else {

//                 const result =
//                     data.result === "OK"
//                         ? "OK"
//                         : "NG";

//                 // =================================================
//                 // ALERT FOR NG
//                 // =================================================

//                 if (result === "NG") {

//                     let msg =
//                         "❌ Invalid Scan";

//                     if (
//                         data.reason ===
//                         "Duplicate"
//                     ) {

//                         msg =
//                             "⚠️ Duplicate Part!";

//                     }
//                     else if (
//                         data.reason ===
//                         "Part Mismatch"
//                     ) {

//                         msg =
//                             "❌ Wrong Part!";

//                     }

//                     setAlertMsg(msg);

//                     setTimeout(() => {

//                         setAlertMsg("");

//                     }, 2000);

//                 }

//                 // =================================================
//                 // BIN COMPLETE CHECK
//                 // =================================================

//                 if (
//                     data.bin_complete
//                 ) {

//                     setStatus(
//                         "COMPLETE"
//                     );

//                     // =================================================
//                     // AUTO RESET AFTER COMPLETE
//                     // =================================================

//                     setTimeout(() => {

//                         setMasterData(
//                             null
//                         );

//                         setScans([]);

//                         setStatus(
//                             "SCAN"
//                         );

//                         focusInput();

//                     }, 3000);

//                 }
//                 else {

//                     setStatus(
//                         result
//                     );

//                 }

//                 // =================================================
//                 // ADD SCAN
//                 // =================================================

//                 setScans(
//                     (prev) => [

//                         {
//                             time:
//                                 new Date()
//                                     .toLocaleTimeString(),

//                             part:
//                                 data.part ||
//                                 masterData.part,

//                             result:
//                                 result,

//                         },

//                         ...prev,

//                     ]
//                 );

//             }

//         }
//         catch (err) {

//             console.error(
//                 "SCAN ERROR:",
//                 err
//             );

//             setStatus(
//                 "NG"
//             );

//             setAlertMsg(
//                 "❌ Server Error"
//             );

//             setTimeout(() => {

//                 setAlertMsg("");

//             }, 2000);

//         }
//         finally {

//             // =================================================
//             // STOP ANIMATION
//             // =================================================

//             setTimeout(() => {

//                 if (
//                     scanBoxRef.current
//                 ) {

//                     scanBoxRef.current.classList.remove(
//                         "active"
//                     );

//                 }

//             }, 150);

//             // =================================================
//             // CLEAR INPUT
//             // =================================================

//             if (
//                 inputRef.current
//             ) {

//                 inputRef.current.value = "";

//             }

//             processingRef.current =
//                 false;

//             // =================================================
//             // FOCUS SCANNER AGAIN
//             // =================================================

//             focusInput();

//         }

//     };

//     // =====================================================
//     // CLEANUP
//     // =====================================================

//     useEffect(() => {

//         return () => {

//             clearTimeout(
//                 scanTimerRef.current
//             );

//         };

//     }, []);

//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <div className="container">

//             {/* =================================================
//                 ALERT TOP
//             ================================================= */}

//             {alertMsg && (

//                 <div className="alert-box">

//                     {alertMsg}

//                 </div>

//             )}

//             {/* =================================================
//                 HEADER
//             ================================================= */}

//             <div className="header">

//                 <img
//                     src={logo}
//                     alt="logo"
//                     className="logo"
//                 />

//                 <a href="./dashboard">

//                     <p>
//                         Dashboard
//                     </p>

//                 </a>

//             </div>

//             {/* =================================================
//                 MAIN SCAN BOX
//             ================================================= */}

//             <div className="mainScan_box">

//                 {/* =================================================
//                     MACHINE IMAGE
//                 ================================================= */}

//                 <div
//                     className={`status1 ${status}`}
//                 >

//                     <img
//                         src={images}
//                         style={{
//                             width: "77%",
//                             height: "100%"
//                         }}
//                         alt="machine"
//                     />

//                 </div>

//                 {/* =================================================
//                     LEFT SCAN AREA
//                 ================================================= */}

//                 <div
//                     className="scan_innerBoxLef"
//                 >

//                     {/* =================================================
//                         STATUS
//                     ================================================= */}

//                     <div
//                         className={`status ${status}`}
//                     >

//                         {status.replace(
//                             "_",
//                             " "
//                         )}

//                     </div>

//                     {/* =================================================
//                         INSTRUCTIONS
//                     ================================================= */}

//                     <div
//                         className="instructions"
//                     >

//                         {!masterData ? (

//                             <p>
//                                 🔵 Step 1:
//                                 Scan Master Barcode
//                             </p>

//                         ) : (

//                             <p>
//                                 🟢 Step 2:
//                                 Scan Parts
//                             </p>

//                         )}

//                     </div>

//                     {/* =================================================
//                         SCAN BOX
//                     ================================================= */}

//                     <div
//                         ref={scanBoxRef}
//                         className="scan-box"
//                     >

//                         <div
//                             className="scan-line"
//                         ></div>

//                         <p>
//                             Scan
//                         </p>

//                     </div>

//                     {/* =================================================
//                         HIDDEN SCANNER INPUT
                        
//                         IMPORTANT:
//                         TEXTAREA is required because your barcode
//                         contains multiple lines.
//                     ================================================= */}

//                     <textarea
//                         ref={inputRef}
//                         className="hidden-input"
//                         autoFocus
//                         autoComplete="off"
//                         spellCheck="false"
//                         onInput={
//                             handleScannerInput
//                         }
//                         onKeyDown={
//                             handleKeyDown
//                         }
//                     />

//                 </div>

//                 {/* =================================================
//                     RIGHT MASTER INFORMATION
//                 ================================================= */}

//                 <div
//                     className="scan_innerBoxrig"
//                 >

//                     {masterData && (

//                         <div
//                             className="master-box"
//                         >

//                             <h1
//                                 style={{
//                                     textAlign:
//                                         "center",
//                                     textDecoration:
//                                         "underline"
//                                 }}
//                             >

//                                 SCANNED DETAILS

//                             </h1>

//                             <br />

//                             <p>
//                                 <b>
//                                     Bin No:
//                                 </b>{" "}
//                                 {masterData.bin_no}
//                             </p>

//                             <p>
//                                 <b>
//                                     Part:
//                                 </b>{" "}
//                                 {masterData.part}
//                             </p>

//                             <p>
//                                 <b>
//                                     Part Name:
//                                 </b>{" "}
//                                 {masterData.part_name}
//                             </p>

//                             <p>
//                                 <b>
//                                     Total Qty:
//                                 </b>{" "}
//                                 {masterData.qty}
//                             </p>

//                             <p>
//                                 <b>
//                                     Total Scans:
//                                 </b>{" "}
//                                 {scans.length}
//                             </p>

//                             <p>
//                                 <b>
//                                     OK Scans:
//                                 </b>{" "}
//                                 {scannedCount}
//                             </p>

//                             <p>
//                                 <b>
//                                     NG Scans:
//                                 </b>{" "}
//                                 {ngCount}
//                             </p>

//                             <p>
//                                 <b>
//                                     Remaining:
//                                 </b>{" "}
//                                 {remainingQty}
//                             </p>

//                         </div>

//                     )}

//                 </div>

//             </div>

//             {/* =================================================
//                 SCAN TABLE
//             ================================================= */}

//             <div className="table">

//                 <h3>
//                     Scan Log
//                 </h3>

//                 <table>

//                     <thead>

//                         <tr>

//                             <th>
//                                 Time
//                             </th>

//                             <th>
//                                 Part No
//                             </th>

//                             <th>
//                                 Result
//                             </th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {scans.map(
//                             (s, i) => (

//                                 <tr
//                                     key={i}
//                                     className={
//                                         s.result === "OK"
//                                             ? "ok-row"
//                                             : "ng-row"
//                                     }
//                                 >

//                                     <td>
//                                         {s.time}
//                                     </td>

//                                     <td>
//                                         {s.part}
//                                     </td>

//                                     <td>
//                                         {s.result}
//                                     </td>

//                                 </tr>

//                             )
//                         )}

//                     </tbody>

//                 </table>

//             </div>

//         </div>

//     );
// }

// export default App;
import React, { useState, useRef, useEffect, useMemo } from "react";
import "./Scan.css";
import logo from "../images/logo.png";
import images from "../images/machine.png";

/* =====================================================
   BEEP SOUND (Web Audio — no extra files needed)
===================================================== */
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (type === "ok") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === "ng") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 220;
      osc.type = "square";
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === "complete") {
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.frequency.value = f;
        o.type = "sine";
        const t = audioCtx.currentTime + i * 0.12;
        g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t);
        o.stop(t + 0.25);
      });
    }
  } catch (e) {
    console.warn("Audio unavailable:", e);
  }
}

/* =====================================================
   PROGRESS RING
===================================================== */
function ProgressRing({ current, target }) {
  const size = 210;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  const offset = circumference - pct * circumference;

  return (
    <div className="progress-ring-wrap">
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle className="bg-circle" cx={size / 2} cy={size / 2} r={radius} />
        <circle
          className="fg-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="center-label">
        <div className="big-num">{current}</div>
        <div className="small-num">of {target}</div>
      </div>
    </div>
  );
}

/* =====================================================
   MAIN APP
===================================================== */
function App() {
  // ---------- EXISTING STATES ----------
  const [status, setStatus] = useState("SCAN");
  const [masterData, setMasterData] = useState(null);
  const [scans, setScans] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");

  // ---------- NEW UI-ONLY STATE ----------
  const [flash, setFlash] = useState(null);
  const [completeModal, setCompleteModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const flashTimer = useRef(null);

  // ---------- COUNTS ----------
  const scannedCount = useMemo(
    () => scans.filter((s) => s.result === "OK").length,
    [scans]
  );
  const ngCount = useMemo(
    () => scans.filter((s) => s.result === "NG").length,
    [scans]
  );
  const remainingQty = masterData ? masterData.qty - scannedCount : 0;

  // ---------- REFS ----------
  const inputRef = useRef(null);
  const scanBoxRef = useRef(null);
  const scanTimerRef = useRef(null);
  const processingRef = useRef(false);

  /* ---------- FLASH HELPER ---------- */
  const triggerFlash = (type) => {
    setFlash(type);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 500);
  };

  /* ---------- INITIAL FOCUS ---------- */
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  /* ---------- KEEP SCANNER INPUT FOCUSED ---------- */
  useEffect(() => {
    const focusScanner = () => {
      if (inputRef.current && !processingRef.current) {
        inputRef.current.focus();
      }
    };
    window.addEventListener("click", focusScanner);
    return () => window.removeEventListener("click", focusScanner);
  }, []);

  /* ---------- FOCUS FUNCTION ---------- */
  const focusInput = () => {
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  /* ---------- SCANNER INPUT (500ms stop detection) ---------- */
  const handleScannerInput = (e) => {
    const value = e.target.value;

    if (value.length > 0) {
      if (scanBoxRef.current) scanBoxRef.current.classList.add("active");
      if (!masterData) setStatus("SCANNING");
    }

    clearTimeout(scanTimerRef.current);

    scanTimerRef.current = setTimeout(() => {
      const completeBarcode = value.trim();

      if (completeBarcode.length === 0) {
        if (inputRef.current) inputRef.current.value = "";
        if (scanBoxRef.current) scanBoxRef.current.classList.remove("active");
        focusInput();
        return;
      }

      processScan(completeBarcode);
    }, 500);
  };

  /* ---------- KEYDOWN — block Enter ---------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  /* ---------- MAIN SCAN FUNCTION ---------- */
  const processScan = async (value) => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      const barcode = value.replace(/\r/g, "").trim();

      console.log("Sending COMPLETE barcode to Python:", barcode);
      console.log("Length:", barcode.length);

      let url = "";

      if (!masterData) {
        url = `http://127.0.0.1:8000/scan-master?barcode=${encodeURIComponent(
          barcode
        )}`;
      } else {
        url = `http://127.0.0.1:8000/scan-part?barcode=${encodeURIComponent(
          barcode
        )}`;
      }

      console.log("API:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("Python Response:", data);

      /* ---------- MASTER SCAN ---------- */
      if (!masterData) {
        if (data.error === "BIN already exists") {
          playSound("ng");
          triggerFlash("ng");
          setAlertMsg("⚠️ BIN already scanned!");
          setTimeout(() => window.location.reload(), 3000);
          return;
        }

        if (data.success === false) {
          playSound("ng");
          triggerFlash("ng");
          setStatus("NG");
          setAlertMsg(data.error || "❌ Invalid Master Barcode");
          setTimeout(() => {
            setAlertMsg("");
            setStatus("SCAN");
          }, 2500);
          return;
        }

        playSound("ok");
        triggerFlash("ok");
        setMasterData(data);
        setStatus("MASTER_SET");

        setTimeout(() => {
          setStatus("SCAN_PART");
          focusInput();
        }, 2000);
      }

      /* ---------- PART SCAN ---------- */
      else {
        const result = data.result === "OK" ? "OK" : "NG";

        if (result === "NG") {
          playSound("ng");
          triggerFlash("ng");

          let msg = "❌ Invalid Scan";
          if (data.reason === "Duplicate") msg = "⚠️ Duplicate Part!";
          else if (data.reason === "Part Mismatch") msg = "❌ Wrong Part!";

          setAlertMsg(msg);
          setTimeout(() => setAlertMsg(""), 2000);
        } else {
          playSound("ok");
          triggerFlash("ok");
        }

        /* -------- BIN COMPLETE -------- */
        if (data.bin_complete) {
          playSound("complete");
          triggerFlash("complete");
          setStatus("COMPLETE");
          setCompleteModal(true);
          setCountdown(3);

          let c = 3;
          const interval = setInterval(() => {
            c -= 1;
            setCountdown(c);
            if (c <= 0) clearInterval(interval);
          }, 1000);

          setTimeout(() => {
            setCompleteModal(false);
            setMasterData(null);
            setScans([]);
            setStatus("SCAN");
            focusInput();
          }, 3000);
        } else {
          setStatus(result);
        }

        /* -------- ADD SCAN -------- */
        setScans((prev) => [
          {
            time: new Date().toLocaleTimeString(),
            part: data.part || masterData.part,
            result: result,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("SCAN ERROR:", err);
      playSound("ng");
      triggerFlash("ng");
      setStatus("NG");
      setAlertMsg("❌ Server Error");
      setTimeout(() => setAlertMsg(""), 2000);
    } finally {
      setTimeout(() => {
        if (scanBoxRef.current) {
          scanBoxRef.current.classList.remove("active");
        }
      }, 150);

      if (inputRef.current) inputRef.current.value = "";
      processingRef.current = false;
      focusInput();
    }
  };

  /* ---------- CLEANUP ---------- */
  useEffect(() => {
    return () => {
      clearTimeout(scanTimerRef.current);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  /* ---------- DERIVED UI ---------- */
  const pct =
    masterData && masterData.qty > 0
      ? Math.round((scannedCount / masterData.qty) * 100)
      : 0;

  const modeLabel = completeModal
    ? "Complete"
    : masterData
    ? "Part Scan"
    : "Master Scan";

  const modeClass = completeModal
    ? "complete"
    : masterData
    ? "part"
    : "master";

  const statusClass = status;

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="scan-page">
      {/* FLASH LAYER */}
      <div
        className={`flash-layer ${flash || ""} ${flash ? "active" : ""}`}
      />

      {/* HEADER */}
      <header className="scan-header">
        <img src={logo} alt="logo" className="logo" />
        <a href="./dashboard">
          <p>📊 Dashboard</p>
        </a>
      </header>

      {/* ALERT */}
      {alertMsg && <div className="scan-alert">{alertMsg}</div>}

      {/* TITLE */}
      <h1 className="scan-title">
        Scan Station
        <span className={`mode-pill ${modeClass}`}>● {modeLabel}</span>
      </h1>

      {/* GRID */}
      <div className="scan-grid">
        {/* LEFT */}
        <div className="scan-left">
          {/* Machine image with halo */}
          <div className={`machine-card ${statusClass}`}>
            <div className="machine-halo" />
            <img src={images} alt="machine" />
          </div>

          {/* Scan card */}
          <div className="scan-card">
            <div className={`scan-status-pill ${statusClass}`}>
              <span className="dot" />
              {status.replace("_", " ")}
            </div>

            <p className="scan-instruction">
              {!masterData
                ? "🔵 Step 1 — Scan master barcode to begin"
                : "🟢 Step 2 — Scan each part"}
            </p>

            <div ref={scanBoxRef} className="scan-target">
              <div className="scan-line" />
              <div className="label">Scan</div>
            </div>

            {/* Hidden textarea — required for multi-line MSIL barcode */}
            <textarea
              ref={inputRef}
              className="hidden-input"
              autoFocus
              autoComplete="off"
              spellCheck="false"
              onInput={handleScannerInput}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="scan-right">
          {masterData ? (
            <>
              {/* Progress */}
              <div className="progress-card">
                <ProgressRing
                  current={scannedCount}
                  target={masterData.qty}
                />
                <div className="pct-label">{pct}% COMPLETE</div>
              </div>

              {/* Master info */}
              <div className="info-card">
                <h3>Scanned Details</h3>

                <div className="info-row">
                  <span className="key">Bin No</span>
                  <span className="val">{masterData.bin_no}</span>
                </div>
                <div className="info-row">
                  <span className="key">Part</span>
                  <span className="val">{masterData.part}</span>
                </div>
                <div className="info-row">
                  <span className="key">Part Name</span>
                  <span className="val">{masterData.part_name}</span>
                </div>
                <div className="info-row">
                  <span className="key">Total Qty</span>
                  <span className="val">{masterData.qty}</span>
                </div>
                <div className="info-row">
                  <span className="key">Total Scans</span>
                  <span className="val">{scans.length}</span>
                </div>
                <div className="info-row">
                  <span className="key">OK</span>
                  <span className="val ok">{scannedCount}</span>
                </div>
                <div className="info-row">
                  <span className="key">NG</span>
                  <span className="val ng">{ngCount}</span>
                </div>
                <div className="info-row">
                  <span className="key">Remaining</span>
                  <span className="val remain">{remainingQty}</span>
                </div>
              </div>

              {/* Recent scans */}
              {scans.length > 0 && (
                <div className="recent-card">
                  <h3>Recent Scans</h3>
                  <ul className="recent-list">
                    {scans.slice(0, 5).map((s, i) => (
                      <li className="recent-item" key={i}>
                        <span className="part">{s.part}</span>
                        <span className="time">{s.time}</span>
                        <span
                          className={`badge ${
                            s.result === "OK" ? "ok" : "ng"
                          }`}
                        >
                          {s.result}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="big">📦</div>
              <p>Scan a master barcode to begin</p>
            </div>
          )}
        </div>
      </div>

      {/* SCAN LOG TABLE */}
      {scans.length > 0 && (
        <div className="table-card">
          <h3>Scan Log</h3>
          <div className="table-wrap">
            <table className="scan-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Part No</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s, i) => (
                  <tr key={i}>
                    <td>{s.time}</td>
                    <td>{s.part}</td>
                    <td>
                      <span
                        className={`badge ${
                          s.result === "OK" ? "ok" : "ng"
                        }`}
                      >
                        {s.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPLETE MODAL */}
      {completeModal && masterData && (
        <div className="complete-overlay">
          <div className="complete-card">
            <div className="check">✅</div>
            <h2>Bin Complete!</h2>
            <p>Label has been sent to the printer</p>

            <div className="mini-info">
              <span>
                <b>Bin:</b> {masterData.bin_no}
              </span>
              <span>
                <b>Part:</b> {masterData.part}
              </span>
              <span>
                <b>Qty:</b> {masterData.qty}
              </span>
            </div>

            <div className="countdown">
              Resetting in {countdown}s…
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;