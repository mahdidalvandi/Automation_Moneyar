import React, { useState, useEffect } from "react";
import axios from "../../lib/axios";
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import CircularProgress from '@mui/material/CircularProgress';
import { MailIcon, MailOpenIcon, PencilAltIcon } from "@heroicons/react/outline";
import { Check } from "@material-ui/icons";
import SvgIcon from '@mui/material/SvgIcon';

function ReferenceTree({ uuid }) {
    const [expanded, setExpanded] = useState([]);
    const [chart, setChart] = useState();

    function MinusSquare(props) {
        return (
            <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
                {/* tslint:disable-next-line: max-line-length */}
                <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
            </SvgIcon>
        );
    }

    function PlusSquare(props) {
        return (
            <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
                {/* tslint:disable-next-line: max-line-length */}
                <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
            </SvgIcon>
        );
    }

    function CloseSquare(props) {
        return (
            <SvgIcon
                className="text-gray-400"
                fontSize="inherit"
                style={{ width: 14, height: 14 }}
                {...props}
            >
                {/* tslint:disable-next-line: max-line-length */}
                <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
            </SvgIcon>
        );
    }

    useEffect(() => {
        axios
            .get(`/api/v1/cartable/reference/${uuid}`).then((res) => {
                setChart([res.data.data]);
            })
    }, []);
    function addToExpanded(val) {
        if (!expanded.includes(val)) {
            setExpanded([...expanded, val]);
        }
    }
    const handleClick = (val) => {
        window.open(`${process.env.NEXT_PUBLIC_FRONT_URL}/cartable/${val}`, "_blank")
    }
    const renderTree = (nodes, i) => (
        <>            {nodes.receivers && Array.isArray(nodes.receivers) ? addToExpanded(`node-${nodes.id}`) : null}
            <TreeItem className="mr-8 mt-1" style={{ borderRight: `${i >= 0 ? "1px dashed" : ""}` }} key={nodes.id} nodeId={`node-${nodes.id}`}
                label={
                    <p className={`flex mt-1 mr-2`}>
                        <div className={`flex ${nodes.is_current ? "bg-green" : ""}`}>
                            {nodes.seen ?
                                <div title="مشاهده شده"><MailOpenIcon className=" h-5 w-5 text-black" aria-hidden="true" /></div> :
                                <div title="مشاهده نشده"><MailIcon className=" h-5 w-5 text-black" aria-hidden="true" /></div>}
                            {nodes.is_copy ?
                                <div title="رونوشت"><PencilAltIcon className=" h-5 w-5 text-black" aria-hidden="true" /></div> :
                                null}
                            <p className="ml-2 mr-2">{nodes.full}</p>
                            {nodes.subject ?
                                <div className="flex">
                                    <div title={nodes.date}><p className="bg-blue-600 text-sm text-white p-1">{` ${nodes.subject ? nodes.subject : ''} `}</p></div>
                                    {/* <button className="rounded-l-md border border-gray-300" onClick={(e) => handleClick(nodes.uuid)} > <p className="ml-1 mr-1 text-sm">مشاهده نامه </p></button> */}
                                    {nodes.is_current ? <div title='نامه جاری'><Check className="text-green-500"></Check></div> : null}
                                </div>
                                : null}
                        </div>
                    </p >
                }>
                {
                    nodes.receivers && Array.isArray(nodes.receivers)
                        ? nodes.receivers.map((node, i) => renderTree(node, i))
                        : null
                }

            </TreeItem ></>
    );

    return (
        chart ?
            <TreeView
                className="bg-gray-100 p-5 rounded-md"
                defaultExpanded={expanded}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                sx={{ height: '600px', width: '100%', flexGrow: 1, maxWidth: 'auto', overflowY: 'auto', opacity: 1 }}
            >
                {renderTree(chart[0], -1)}

            </TreeView> : <CircularProgress className=" ml-1 h-5 w-5" />

    );
}
export default ReferenceTree;
