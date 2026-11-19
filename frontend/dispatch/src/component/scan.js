// // python3 -m uvicorn app:app --reload 

// import React, { useState, useRef, useEffect } from "react";
// import "../App.css";
// import logo from "../images/logo.png";
// import images from "../images/machine.png"

// function App() {
//     const [status, setStatus] = useState("SCAN");
//     const [masterData, setMasterData] = useState(null);
//     const [scans, setScans] = useState([]);
//     const scannedCount = scans.length;
//     const remainingQty = masterData ? (masterData.qty - scannedCount) : 0;
//     const inputRef = useRef();
//     const scanBoxRef = useRef();

//     useEffect(() => {
//         inputRef.current.focus();
//     }, []);

//     // 🔥 START ANIMATION (ONLY MASTER)
//     const handleKeyDown = (e) => {
//         if (e.key !== "Enter") {
//             if (!masterData) {
//                 scanBoxRef.current.classList.add("active");
//                 setStatus("SCANNING");
//             }
//         }
//     };

//     // 🔷 FINAL SCAN
//     const handleScan = async (e) => {
//         if (e.key === "Enter") {
//             const value = e.target.value;

//             try {
//                 let url = "";

//                 if (!masterData) {
//                     url = `http://127.0.0.1:8000/scan-master?barcode=${value}`;
//                 } else {
//                     url = `http://127.0.0.1:8000/scan-part?barcode=${value}`;
//                 }

//                 const res = await fetch(url);
//                 const data = await res.json();

//                 // 🔵 MASTER SCAN
//                 if (!masterData) {
//                     setMasterData(data);
//                     setStatus("MASTER_SET");

//                     setTimeout(() => {
//                         setStatus("SCAN_PART");
//                     }, 2000);

//                 }
//                 // 🟢 PART SCAN
//                 else {
//                     const result = data.result === "OK" ? "OK" : "NG";

//                     // 🔥 BIN COMPLETE CHECK
//                     if (data.bin_complete) {
//                         setStatus("COMPLETE");

//                         // 🔥 AUTO RESET AFTER COMPLETE
//                         setTimeout(() => {
//                             setMasterData(null);
//                             setScans([]);
//                             setStatus("SCAN");
//                             inputRef.current.focus();
//                         }, 3000);

//                     } else {
//                         setStatus(result);
//                     }

//                     setScans((prev) => [
//                         {
//                             time: new Date().toLocaleTimeString(),
//                             part: data.part || masterData.part,
//                             result: result,
//                         },
//                         ...prev,
//                     ]);
//                 }

//             } catch (err) {
//                 setStatus("NG");
//             }

//             // 🔥 STOP ANIMATION FAST
//             setTimeout(() => {
//                 scanBoxRef.current.classList.remove("active");
//             }, 150);

//             e.target.value = "";
//         }
//     };

//     return (
//         <div className="container">

//             {/* 🔷 HEADER */}
//             <div className="header">
//                 <img src={logo} alt="logo" className="logo" />
//                 <a href="./dashboard"><p>Dashboard</p></a>
//             </div>
//             <div className="mainScan_box">
//                 <div className={`status1 ${status}`}>
//                     <img src={images} style={{ width: '77%', height: '100%' }}></img>
//                 </div>
//                 <div className="scan_innerBoxLef">
//                     {/* 🔷 STATUS */}
//                     <div className={`status ${status}`}>
//                         {status.replace("_", " ")}
//                     </div>

//                     {/* 🔷 INSTRUCTIONS */}
//                     <div className="instructions">
//                         {!masterData ? (
//                             <p>🔵 Step 1: Scan Master Barcode</p>
//                         ) : (
//                             // <p>🟢 Step 2: Scan Parts ({masterData.qty})</p>
//                             <p>🟢 Step 2: Scan Parts</p>

//                         )}
//                     </div>

//                     {/* 🔷 SCAN BOX */}
//                     <div ref={scanBoxRef} className="scan-box">
//                         <div className="scan-line"></div>
//                         <p>Scan </p>
//                     </div>

//                     {/* 🔷 HIDDEN INPUT */}
//                     <input
//                         ref={inputRef}
//                         className="hidden-input"
//                         onKeyDown={(e) => {
//                             handleKeyDown(e);
//                             handleScan(e);
//                         }}
//                     />
//                 </div>
//                 <div className="scan_innerBoxrig">

//                     {/* 🔷 MASTER INFO */}
//                     {masterData && (
//                         <div className="master-box">
//                             <h1 style={{ textAlign: "center", textDecoration: 'underline' }}>
//                                 SCANNED DETAILS
//                             </h1><br />

//                             <p><b>Bin No:</b> {masterData.bin_no}</p>
//                             <p><b>Part:</b> {masterData.part}</p>
//                             <p><b>Part Name:</b> {masterData.part_name}</p>
//                             <p><b>Total Qty:</b> {masterData.qty}</p>

//                             {/* 🔥 NEW */}
//                             <p><b>Scanned:</b> {scannedCount}</p>
//                             <p><b>Remaining:</b> {remainingQty}</p>

//                         </div>
//                     )}
//                 </div>
//             </div>



//             {/* 🔷 TABLE */}
//             <div className="table">
//                 <h3>Scan Log</h3>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Time</th>
//                             <th>Part No</th>
//                             <th>Result</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {scans.map((s, i) => (
//                             <tr key={i} className={s.result === "OK" ? "ok-row" : "ng-row"}>
//                                 <td>{s.time}</td>
//                                 <td>{s.part}</td>
//                                 <td>{s.result}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//         </div>
//     );
// }

// export default App;

// python3 -m uvicorn app:app --reload 


import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import logo from "../images/logo.png";
import images from "../images/machine.png";

function App() {

    // =====================================================
    // EXISTING STATES - KEPT
    // =====================================================

    const [status, setStatus] = useState("SCAN");
    const [masterData, setMasterData] = useState(null);
    const [scans, setScans] = useState([]);
    const [alertMsg, setAlertMsg] = useState("");

    // =====================================================
    // EXISTING COUNTS - KEPT
    // =====================================================

    const scannedCount = scans.filter(
        (s) => s.result === "OK"
    ).length;

    const ngCount = scans.filter(
        (s) => s.result === "NG"
    ).length;

    const remainingQty = masterData
        ? masterData.qty - scannedCount
        : 0;

    // =====================================================
    // REFS
    // =====================================================

    const inputRef = useRef(null);
    const scanBoxRef = useRef(null);

    // Timer used to detect end of scanner input
    const scanTimerRef = useRef(null);

    // Prevent two scans from processing together
    const processingRef = useRef(false);

    // =====================================================
    // INITIAL FOCUS
    // =====================================================

    useEffect(() => {

        if (inputRef.current) {
            inputRef.current.focus();
        }

    }, []);

    // =====================================================
    // KEEP SCANNER INPUT FOCUSED
    // =====================================================

    useEffect(() => {

        const focusScanner = () => {

            if (
                inputRef.current &&
                !processingRef.current
            ) {

                inputRef.current.focus();

            }

        };

        window.addEventListener(
            "click",
            focusScanner
        );

        return () => {

            window.removeEventListener(
                "click",
                focusScanner
            );

        };

    }, []);

    // =====================================================
    // FOCUS FUNCTION
    // =====================================================

    const focusInput = () => {

        setTimeout(() => {

            if (inputRef.current) {

                inputRef.current.focus();

            }

        }, 100);

    };

    // =====================================================
    // ALERT FUNCTION
    // =====================================================

    const showAlert = (
        message,
        duration = 2000
    ) => {

        setAlertMsg(message);

        setTimeout(() => {

            setAlertMsg("");

        }, duration);

    };

    // =====================================================
    // SCANNER INPUT
    //
    // IMPORTANT:
    //
    // Your MSIL scanner sends:
    //
    // 2090782072034
    // 28100M75T80-C48
    // 2
    // LEVER ASSY,GEAR SHF CONT
    // ...
    //
    // Therefore we DO NOT process Enter.
    //
    // We wait until scanner stops sending data.
    // =====================================================

    const handleScannerInput = (e) => {

        const value = e.target.value;

        console.log(
            "Scanner input received:",
            JSON.stringify(value)
        );

        // =================================================
        // START SCANNING ANIMATION
        // =================================================

        if (value.length > 0) {

            if (scanBoxRef.current) {

                scanBoxRef.current.classList.add(
                    "active"
                );

            }

            // Keep your original status logic:
            // SCANNING only before master
            if (!masterData) {

                setStatus("SCANNING");

            }

        }

        // =================================================
        // CLEAR PREVIOUS TIMER
        // =================================================

        clearTimeout(
            scanTimerRef.current
        );

        // =================================================
        // WAIT FOR COMPLETE BARCODE
        // =================================================

        scanTimerRef.current = setTimeout(() => {

            const completeBarcode =
                value.trim();

            console.log(
                "======================================"
            );

            console.log(
                "SCANNER FINISHED"
            );

            console.log(
                "COMPLETE BARCODE:"
            );

            console.log(
                completeBarcode
            );

            console.log(
                "BARCODE LENGTH:",
                completeBarcode.length
            );

            console.log(
                "======================================"
            );

            // Don't process empty input
            if (
                completeBarcode.length === 0
            ) {

                if (inputRef.current) {

                    inputRef.current.value = "";

                }

                if (scanBoxRef.current) {

                    scanBoxRef.current.classList.remove(
                        "active"
                    );

                }

                focusInput();

                return;

            }

            // Process complete barcode
            processScan(
                completeBarcode
            );

        }, 500);

    };

    // =====================================================
    // KEYDOWN
    //
    // We only prevent Enter from submitting early.
    //
    // We DO NOT use Enter to process barcode.
    // =====================================================

    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

        }

    };

    // =====================================================
    // MAIN SCAN FUNCTION
    //
    // YOUR EXISTING LOGIC IS PRESERVED
    // =====================================================

    const processScan = async (value) => {

        // Prevent duplicate processing
        if (processingRef.current) {

            return;

        }

        processingRef.current = true;

        try {

            // =================================================
            // CLEAN BARCODE
            //
            // IMPORTANT:
            // Keep newline structure.
            // Only remove \r generated by Windows/scanner.
            // =================================================

            const barcode =
                value
                    .replace(/\r/g, "")
                    .trim();

            console.log(
                "Sending COMPLETE barcode to Python:"
            );

            console.log(
                barcode
            );

            console.log(
                "Length:",
                barcode.length
            );

            // =================================================
            // API URL
            // =================================================

            let url = "";

            // =================================================
            // MASTER SCAN
            // =================================================

            if (!masterData) {

                url =
                    `http://127.0.0.1:8000/scan-master?barcode=${encodeURIComponent(
                        barcode
                    )}`;

            }

            // =================================================
            // PART SCAN
            // =================================================

            else {

                url =
                    `http://127.0.0.1:8000/scan-part?barcode=${encodeURIComponent(
                        barcode
                    )}`;

            }

            console.log(
                "API:",
                url
            );

            // =================================================
            // SEND TO PYTHON
            // =================================================

            const res =
                await fetch(url);

            const data =
                await res.json();

            console.log(
                "Python Response:",
                data
            );

            // =================================================
            // MASTER SCAN
            // =================================================

            if (!masterData) {

                // =================================================
                // BIN EXISTS ALERT
                // =================================================

                if (
                    data.error ===
                    "BIN already exists"
                ) {

                    setAlertMsg(
                        "⚠️ BIN already scanned!"
                    );

                    setTimeout(() => {

                        window.location.reload();

                    }, 3000);

                    return;

                }

                // =================================================
                // INVALID MASTER BARCODE
                // =================================================

                if (
                    data.success === false
                ) {

                    setStatus("NG");

                    setAlertMsg(
                        data.error ||
                        "❌ Invalid Master Barcode"
                    );

                    setTimeout(() => {

                        setAlertMsg("");

                        setStatus("SCAN");

                    }, 2500);

                    return;

                }

                // =================================================
                // MASTER SUCCESS
                // =================================================

                setMasterData(data);

                setStatus(
                    "MASTER_SET"
                );

                setTimeout(() => {

                    setStatus(
                        "SCAN_PART"
                    );

                    focusInput();

                }, 2000);

            }

            // =================================================
            // PART SCAN
            // =================================================

            else {

                const result =
                    data.result === "OK"
                        ? "OK"
                        : "NG";

                // =================================================
                // ALERT FOR NG
                // =================================================

                if (result === "NG") {

                    let msg =
                        "❌ Invalid Scan";

                    if (
                        data.reason ===
                        "Duplicate"
                    ) {

                        msg =
                            "⚠️ Duplicate Part!";

                    }
                    else if (
                        data.reason ===
                        "Part Mismatch"
                    ) {

                        msg =
                            "❌ Wrong Part!";

                    }

                    setAlertMsg(msg);

                    setTimeout(() => {

                        setAlertMsg("");

                    }, 2000);

                }

                // =================================================
                // BIN COMPLETE CHECK
                // =================================================

                if (
                    data.bin_complete
                ) {

                    setStatus(
                        "COMPLETE"
                    );

                    // =================================================
                    // AUTO RESET AFTER COMPLETE
                    // =================================================

                    setTimeout(() => {

                        setMasterData(
                            null
                        );

                        setScans([]);

                        setStatus(
                            "SCAN"
                        );

                        focusInput();

                    }, 3000);

                }
                else {

                    setStatus(
                        result
                    );

                }

                // =================================================
                // ADD SCAN
                // =================================================

                setScans(
                    (prev) => [

                        {
                            time:
                                new Date()
                                    .toLocaleTimeString(),

                            part:
                                data.part ||
                                masterData.part,

                            result:
                                result,

                        },

                        ...prev,

                    ]
                );

            }

        }
        catch (err) {

            console.error(
                "SCAN ERROR:",
                err
            );

            setStatus(
                "NG"
            );

            setAlertMsg(
                "❌ Server Error"
            );

            setTimeout(() => {

                setAlertMsg("");

            }, 2000);

        }
        finally {

            // =================================================
            // STOP ANIMATION
            // =================================================

            setTimeout(() => {

                if (
                    scanBoxRef.current
                ) {

                    scanBoxRef.current.classList.remove(
                        "active"
                    );

                }

            }, 150);

            // =================================================
            // CLEAR INPUT
            // =================================================

            if (
                inputRef.current
            ) {

                inputRef.current.value = "";

            }

            processingRef.current =
                false;

            // =================================================
            // FOCUS SCANNER AGAIN
            // =================================================

            focusInput();

        }

    };

    // =====================================================
    // CLEANUP
    // =====================================================

    useEffect(() => {

        return () => {

            clearTimeout(
                scanTimerRef.current
            );

        };

    }, []);

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="container">

            {/* =================================================
                ALERT TOP
            ================================================= */}

            {alertMsg && (

                <div className="alert-box">

                    {alertMsg}

                </div>

            )}

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="header">

                <img
                    src={logo}
                    alt="logo"
                    className="logo"
                />

                <a href="./dashboard">

                    <p>
                        Dashboard
                    </p>

                </a>

            </div>

            {/* =================================================
                MAIN SCAN BOX
            ================================================= */}

            <div className="mainScan_box">

                {/* =================================================
                    MACHINE IMAGE
                ================================================= */}

                <div
                    className={`status1 ${status}`}
                >

                    <img
                        src={images}
                        style={{
                            width: "77%",
                            height: "100%"
                        }}
                        alt="machine"
                    />

                </div>

                {/* =================================================
                    LEFT SCAN AREA
                ================================================= */}

                <div
                    className="scan_innerBoxLef"
                >

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div
                        className={`status ${status}`}
                    >

                        {status.replace(
                            "_",
                            " "
                        )}

                    </div>

                    {/* =================================================
                        INSTRUCTIONS
                    ================================================= */}

                    <div
                        className="instructions"
                    >

                        {!masterData ? (

                            <p>
                                🔵 Step 1:
                                Scan Master Barcode
                            </p>

                        ) : (

                            <p>
                                🟢 Step 2:
                                Scan Parts
                            </p>

                        )}

                    </div>

                    {/* =================================================
                        SCAN BOX
                    ================================================= */}

                    <div
                        ref={scanBoxRef}
                        className="scan-box"
                    >

                        <div
                            className="scan-line"
                        ></div>

                        <p>
                            Scan
                        </p>

                    </div>

                    {/* =================================================
                        HIDDEN SCANNER INPUT
                        
                        IMPORTANT:
                        TEXTAREA is required because your barcode
                        contains multiple lines.
                    ================================================= */}

                    <textarea
                        ref={inputRef}
                        className="hidden-input"
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                        onInput={
                            handleScannerInput
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                    />

                </div>

                {/* =================================================
                    RIGHT MASTER INFORMATION
                ================================================= */}

                <div
                    className="scan_innerBoxrig"
                >

                    {masterData && (

                        <div
                            className="master-box"
                        >

                            <h1
                                style={{
                                    textAlign:
                                        "center",
                                    textDecoration:
                                        "underline"
                                }}
                            >

                                SCANNED DETAILS

                            </h1>

                            <br />

                            <p>
                                <b>
                                    Bin No:
                                </b>{" "}
                                {masterData.bin_no}
                            </p>

                            <p>
                                <b>
                                    Part:
                                </b>{" "}
                                {masterData.part}
                            </p>

                            <p>
                                <b>
                                    Part Name:
                                </b>{" "}
                                {masterData.part_name}
                            </p>

                            <p>
                                <b>
                                    Total Qty:
                                </b>{" "}
                                {masterData.qty}
                            </p>

                            <p>
                                <b>
                                    Total Scans:
                                </b>{" "}
                                {scans.length}
                            </p>

                            <p>
                                <b>
                                    OK Scans:
                                </b>{" "}
                                {scannedCount}
                            </p>

                            <p>
                                <b>
                                    NG Scans:
                                </b>{" "}
                                {ngCount}
                            </p>

                            <p>
                                <b>
                                    Remaining:
                                </b>{" "}
                                {remainingQty}
                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* =================================================
                SCAN TABLE
            ================================================= */}

            <div className="table">

                <h3>
                    Scan Log
                </h3>

                <table>

                    <thead>

                        <tr>

                            <th>
                                Time
                            </th>

                            <th>
                                Part No
                            </th>

                            <th>
                                Result
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {scans.map(
                            (s, i) => (

                                <tr
                                    key={i}
                                    className={
                                        s.result === "OK"
                                            ? "ok-row"
                                            : "ng-row"
                                    }
                                >

                                    <td>
                                        {s.time}
                                    </td>

                                    <td>
                                        {s.part}
                                    </td>

                                    <td>
                                        {s.result}
                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default App;