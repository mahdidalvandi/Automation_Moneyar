import { useEffect, useState } from "react";
// ELEMENTS
import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
require("react-big-calendar/lib/css/react-big-calendar.css");

// LIB
import axios from "../../../lib/axios";
import moment from "jalali-moment";
moment.locale("fa");

import { useAuth } from "../../../hooks/auth";

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function ProceedingsList() {
    const { asPath } = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [isHolding, setIsHolding] = useState(false);


    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    useEffect(() => {
        GetData();
    }, []);

    const GetData = () => {
        axios
            .get(
                `/api/v1/training/video/list`
            )
            .then((res) => {
                setLoading(false);
                setData(res.data.data)
            })
    }

    if (isLoading || !user || loading) {
        return null;
    }
    function CheckIfAccess(val) {
        if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
        return false;
    }

    const card = (link, title) => (
        <React.Fragment>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <div className="flex justify-center">
                    <iframe src={link}
                        allowFullScreen="true"
                        webkitallowfullscreen="true"
                        mozallowfullscreen="true"
                    /></div>
            </CardContent>
            {/* <CardActions>
                <Button size="small"></Button>
            </CardActions> */}
        </React.Fragment>
    );

    return (
        <div>
            <SidebarMobile menu={navigationList()} loc={asPath} />
            <SidebarDesktop menu={navigationList()} loc={asPath}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => setIsHolding(props.isHolding)}
                setSuperUser={(props) => { }} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
                <main>
                    <div className="py-6">
                        <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
                            <div className="bg-white px-4 py-5  sm:px-6">
                                <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                    <div className="ml-4 flex items-center">
                                        <h2 className="text-lg leading-6 font-large text-gray-900">
                                            ویدیو های راهنما
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data ?
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                <div className="grid lg:grid-cols-4 xs:grid-cols-1 gap-5">

                                    {data.map((item) => (
                                        
                                        CheckIfAccess(item.url) ?                                         
                                        <div className="col-span-1">
                                            <Box sx={{ minWidth: 275 }}>
                                                <Card variant="outlined">{card(`https://www.aparat.com/video/video/embed/videohash/${item.link}/vt/frame`, `${item.title}`)}</Card>
                                            </Box>
                                        </div> : null
                                    ))}                                    
                                </div>

                            </div> : null}
                    </div>
                </main>
            </div>
        </div>
    );
}
