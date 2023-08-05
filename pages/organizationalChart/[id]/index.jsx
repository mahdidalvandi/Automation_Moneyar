import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import React, { useState, useRef, useEffect } from "react";
import { OrganizationChart } from 'primereact/organizationchart';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "../../../lib/axios";
import { loadImageFromServer } from "../../../lib/helper";

const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};

export default function OrganizationalChart() {
    let componentRef = useRef();
    const ref = React.useRef(null);
    const { asPath } = useRouter();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();


    const [chart, setChart] = useState();
    useEffect(() => {
        setTimeout(() => {
            setWidth(ref.current && ref.current.scrollWidth ? ref.current.scrollWidth : 0)
            setHeight(ref.current && ref.current.scrollHeight ? ref.current.scrollHeight : 0)
        }, 2000);
    }, [ref.current]);

    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div >
                    <Image loader={myLoader} alt={node.data.name} src={node.data.image} className="mb-3 ml-auto mr-auto" height={50} width={50} style={{ borderRadius: '50%' }} />
                    <p className="font-bold font-small  mb-2">{node.data.name}</p>
                    <p className="font-small text-sm">{node.data.title}</p>
                </div>
            );
        }
        return node.label;
    };

    const openLinkInNewTab = () => {
        const newTab = window.open(`${process.env.NEXT_PUBLIC_FRONT_URL}/organizationalChart/print/${router.query.id}?w=${width}&h=${height}`, '_blank', 'noopener,noreferrer');
        if (newTab) newTab.opener = null;
    }

    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            axios.post('/api/v1/company/post/chart',
                {
                    uuid: router.query.id
                }).then((res) => {
                    setChart(res.data.data.chartData);
                })
        }
    }, [router.isReady]);

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    if (isLoading || !user) {
        return null;
    }

    return (
        <div>

            <SidebarMobile menu={navigationList()} loc={asPath} />
            <SidebarDesktop menu={navigationList()} loc={asPath}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => { }}
                setSuperUser={(props) => { }} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
            </div>
            <main style={{ direction: "ltr" }} className="py-1 space-y-6 md:pr-52 " ref={(el) => (componentRef = el)}>
                <button onClick={openLinkInNewTab} disabled={width && height ? false : true} className={`${width && height ? "bg-[#1f2937]" : "bg-gray-400" } text-white px-2 py-2 rounded-md text-sm inline-block ml-1`}>خروجی تصویر</button>
                <div className="flex overflow-x-auto" ref={ref}>
                    {chart ? <OrganizationChart value={chart} nodeTemplate={nodeTemplate} /> : null}
                </div>
            </main>

        </div>
    );
}
