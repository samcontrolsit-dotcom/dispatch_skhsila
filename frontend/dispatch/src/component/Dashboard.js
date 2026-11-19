import React, {
    useState
} from "react";
import logo from "../images/logo.png";
import axios from "axios";

import {
    Bar,
    Pie
} from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);


const API_URL =
    "http://127.0.0.1:8000";


export default function Dashboard() {


    const [binNo, setBinNo] =
        useState("");


    const [partNo, setPartNo] =
        useState("");


    const [fromDate, setFromDate] =
        useState("");


    const [toDate, setToDate] =
        useState("");


    const [data, setData] =
        useState([]);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = async () => {

        try {

            setLoading(true);

            setError("");


            const res =
                await axios.get(
                    `${API_URL}/search`,
                    {
                        params: {
                            bin_no: binNo,
                            part_no: partNo,
                            from_date: fromDate,
                            to_date: toDate
                        }
                    }
                );


            if (
                res.data &&
                res.data.error
            ) {

                setError(
                    res.data.error
                );

                setData([]);

                return;
            }


            setData(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        }
        catch (err) {

            console.error(
                "SEARCH ERROR:",
                err
            );


            setError(
                err.response?.data?.error ||
                err.message ||
                "Unable to connect to Python server"
            );

            setData([]);

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // COUNTS
    // =====================================================

    const totalOK =
        data.reduce(
            (sum, m) =>
                sum +
                Number(m.ok_count || 0),
            0
        );


    const totalNG =
        data.reduce(
            (sum, m) =>
                sum +
                Number(m.ng_count || 0),
            0
        );


    // =====================================================
    // PIE
    // =====================================================

    const pieData = {

        labels: [
            "OK",
            "NG"
        ],

        datasets: [
            {
                data: [
                    totalOK,
                    totalNG
                ],

                backgroundColor: [
                    "green",
                    "red"
                ]
            }
        ]

    };


    // =====================================================
    // BIN-WISE OK
    // =====================================================

    const barData = {

        labels:
            data.map(
                m => m.bin_no
            ),

        datasets: [

            {

                label:
                    "OK Count",

                data:
                    data.map(
                        m =>
                            Number(
                                m.ok_count || 0
                            )
                    ),

                backgroundColor:
                    "green"

            }

        ]

    };


    // =====================================================
    // QTY
    // =====================================================

    const qtyData = {

        labels:
            data.map(
                m => m.bin_no
            ),

        datasets: [

            {

                label:
                    "Total Qty",

                data:
                    data.map(
                        m =>
                            Number(
                                m.qty || 0
                            )
                    ),

                backgroundColor:
                    "blue"

            },

            {

                label:
                    "Scanned",

                data:
                    data.map(
                        m =>
                            Number(
                                m.scanned_qty || 0
                            )
                    ),

                backgroundColor:
                    "orange"

            }

        ]

    };


    // =====================================================
    // PRINT
    // =====================================================

    const handlePrint = async (
        binNo,
        partNo,
        qty
    ) => {

        try {

            const res =
                await axios.get(
                    `${API_URL}/print-label`,
                    {
                        params: {
                            bin_no: binNo,
                            part_no: partNo,
                            qty: qty
                        }
                    }
                );


            if (
                res.data?.success
            ) {

                alert(
                    "✅ Printed successfully"
                );

            }
            else {

                alert(
                    `❌ ${
                        res.data?.error ||
                        "Print failed"
                    }`
                );

            }

        }
        catch (err) {

            console.error(
                "PRINT ERROR:",
                err
            );


            alert(
                "❌ Unable to connect to Python printer service"
            );

        }

    };


    return (

        <div
            style={{
                padding: 20
            }}
        >
                        <div className="header">
            
                            <img
                                src={logo}
                                alt="logo"
                                className="logo"
                            />
            
                            <a href="/">
            
                                <p>
                                    SCAN
                                </p>
            
                            </a>
            
                        </div>


            <h2>
                Production Binning Dashboard
            </h2>


            {/* ============================================
                ERROR
            ============================================ */}

            {error && (

                <div
                    style={{
                        background: "#ffdddd",
                        border: "1px solid red",
                        padding: 10,
                        marginBottom: 20,
                        color: "red"
                    }}
                >

                    ❌ {error}

                </div>

            )}


            {/* ============================================
                FILTERS
            ============================================ */}

            <div
                style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap"
                }}
            >

                <input
                    placeholder="Bin No"
                    value={binNo}
                    onChange={
                        e =>
                            setBinNo(
                                e.target.value
                            )
                    }
                />


                <input
                    placeholder="Part No"
                    value={partNo}
                    onChange={
                        e =>
                            setPartNo(
                                e.target.value
                            )
                    }
                />


                <label>
                    From:
                </label>


                <input
                    type="date"
                    value={fromDate}
                    onChange={
                        e =>
                            setFromDate(
                                e.target.value
                            )
                    }
                />


                <label>
                    To:
                </label>


                <input
                    type="date"
                    value={toDate}
                    onChange={
                        e =>
                            setToDate(
                                e.target.value
                            )
                    }
                />


                <button
                    onClick={
                        handleSearch
                    }
                    disabled={
                        loading
                    }
                >

                    {loading
                        ? "Searching..."
                        : "Search"
                    }

                </button>

            </div>


            {/* ============================================
                SUMMARY
            ============================================ */}

            <div
                style={{
                    display: "flex",
                    gap: 20,
                    marginTop: 30,
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border: "2px solid green",
                        padding: 15,
                        minWidth: 150
                    }}
                >

                    <h3>
                        Total OK
                    </h3>

                    <h2>
                        {totalOK}
                    </h2>

                </div>


                <div
                    style={{
                        border: "2px solid red",
                        padding: 15,
                        minWidth: 150
                    }}
                >

                    <h3>
                        Total NG
                    </h3>

                    <h2>
                        {totalNG}
                    </h2>

                </div>


                <div
                    style={{
                        border: "2px solid black",
                        padding: 15,
                        minWidth: 150
                    }}
                >

                    <h3>
                        Bins
                    </h3>

                    <h2>
                        {data.length}
                    </h2>

                </div>

            </div>


            {/* ============================================
                PIE
            ============================================ */}

            <div
                style={{
                    display: "flex",
                    gap: 40,
                    marginTop: 30
                }}
            >

                <div
                    style={{
                        width: 300
                    }}
                >

                    <h3>
                        OK vs NG
                    </h3>

                    <Pie
                        data={pieData}
                    />

                </div>

            </div>


            {/* ============================================
                BIN-WISE OK
            ============================================ */}

            <div
                style={{
                    display: "flex",
                    gap: 40,
                    marginTop: 30
                }}
            >

                <div
                    style={{
                        width: 500
                    }}
                >

                    <h3>
                        Bin-wise OK
                    </h3>

                    <Bar
                        data={barData}
                    />

                </div>

            </div>


            {/* ============================================
                QTY VS SCANNED
            ============================================ */}

            <div
                style={{
                    width: 600,
                    marginTop: 40
                }}
            >

                <h3>
                    Qty vs Scanned
                </h3>

                <Bar
                    data={qtyData}
                />

            </div>


            {/* ============================================
                MASTER DATA
            ============================================ */}

            {data.map(
                (m, i) => (

                    <div
                        key={i}
                        style={{
                            border:
                                "2px solid black",
                            marginTop: 20,
                            padding: 10
                        }}
                    >


                        <h3>
                            MASTER
                        </h3>


                        <p>
                            <b>Bin:</b>{" "}
                            {m.bin_no}
                        </p>


                        <p>
                            <b>Part:</b>{" "}
                            {m.part_no}
                        </p>


                        <p>
                            <b>Part Name:</b>{" "}
                            {m.part_name}
                        </p>


                        <p>
                            <b>Qty:</b>{" "}
                            {m.qty}
                        </p>


                        <p>
                            <b>Scanned:</b>{" "}
                            {m.scanned_qty}
                        </p>


                        <p>

                            <b>OK:</b>{" "}
                            {m.ok_count}

                            {" | "}

                            <b>NG:</b>{" "}
                            {m.ng_count}

                        </p>


                        {/* PRINT */}

                        <button
                            onClick={() =>
                                handlePrint(
                                    m.bin_no,
                                    m.part_no,
                                    m.qty
                                )
                            }
                        >

                            Print Label

                        </button>


                        {/* =================================
                            SCAN TABLE
                        ================================= */}

                        <table
                            border="1"
                            width="100%"
                            style={{
                                marginTop: 10,
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Time
                                    </th>

                                    <th>
                                        Serial
                                    </th>

                                    <th>
                                        Result
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {m.scans.map(
                                    (s, j) => (

                                        <tr
                                            key={j}
                                            style={{
                                                background:
                                                    s.result === "NG"
                                                        ? "#ff0101"
                                                        : "#00ff00"
                                            }}
                                        >

                                            <td>
                                                {s.date}
                                            </td>

                                            <td>
                                                {s.time}
                                            </td>

                                            <td>
                                                {s.serial_no}
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

                )
            )}

        </div>

    );

}