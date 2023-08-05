import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/auth";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { OrganizationChart } from 'primereact/organizationchart';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import axios from "../../../../lib/axios";
import { toPng } from 'html-to-image';
import { loadImageFromServer } from "../../../../lib/helper";

const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};
export default function OrganizationalChart() {
    let componentRef = useRef();
    const ref = React.useRef(null);
    const { asPath } = useRouter();
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const onButtonClick = useCallback(() => {
        if (ref.current === null) {
            return
        }

        toPng(ref.current, { cacheBust: true,backgroundColor:'white' })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = 'OrgChart.png'
                link.href = dataUrl
                link.click()                
            })
            .catch((err) => {
                
            })
    }, [ref])

    const [chart, setChart] = useState();
    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div >
                    {/* <Image loader={myLoader} alt={node.data.name} src={node.data.image} className="mb-3 ml-auto mr-auto" height={50} width={50} style={{ borderRadius: '50%' }} /> */}
                    <p className="font-bold font-small  mb-2">{node.data.name}</p>
                    <p className="font-small text-sm">{node.data.title}</p>
                </div>
            );
        }

        return node.label;
    };

    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            let search = window.location.search;
            let params = new URLSearchParams(search);
            setWidth(params.get('w'));
            setHeight(params.get('h'));
            axios.post('/api/v1/company/post/chart',
                {
                    uuid: router.query.id
                }).then((res) => {
                    setChart(res.data.data.chartData);
                })
        }
    }, [router.isReady]);

    useEffect(() => {
        onButtonClick()
    }, [chart]);

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    if (isLoading || !user) {
        return null;
    }

    return (
        <main style={{ direction: "ltr" }} className="py-1 space-y-6 md:pr-52 " ref={(el) => (componentRef = el)}>            
            <div className="card overflow-x-auto" style={{
                width: `${width}px`,
                height: `${height}px`
            }} ref={ref}>
                {chart ? <OrganizationChart value={chart} nodeTemplate={nodeTemplate} /> : null}
            </div>
        </main>
    );
}
