import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../../hooks/auth";
import { useCartable } from "../../../../hooks/cartable";
import MailDetails from "../../../../components/mails/mailDetails";
import Link from "next/link";
import { useRouter } from "next/router";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDownIcon } from "@heroicons/react/solid";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function ViewEmail() {
    const { asPath } = useRouter();
    const [currentUserRole, setCurrentUserRole] = useState();
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            getMail(router.query.id);
            setSource(router.query.source)
        }
    }, [router.isReady]);

    const { getMail, letterData, isCartableLoading } = useCartable();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [source, setSource] = useState();
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
                <main>
                    {Object.keys(letterData).length > 0
                        ? letterData.reverse().map((letter, i) =>
                            letterData[i].type != 0 ? (
                                <Accordion className="!m-0">
                                    <AccordionSummary
                                        aria-controls={
                                            "panel" +
                                            letterData[i].id +
                                            "d-content"
                                        }
                                        id={
                                            "panel" +
                                            letterData[i].id +
                                            "d-header"
                                        }
                                        className="bg-amber-500"
                                        expandIcon={
                                            <ChevronDownIcon
                                                className="ml-2 h-8 w-8 text-white"
                                                aria-hidden="true"
                                            />
                                        }
                                    >
                                        <h3 className="text-md text-white">
                                            {letterData[i].subject}
                                        </h3>
                                    </AccordionSummary>
                                    <AccordionDetails className="bg-gray-200">
                                        <MailDetails
                                            subject={letterData[i].subject}
                                            author={letterData[i].author}
                                            create_date_time={
                                                letterData[i].create_date_time
                                            }
                                            recipient={
                                                letterData[i].recipient_names
                                            }
                                            isCopy={
                                                letterData[i].copies_names
                                            }
                                            body={letterData[i].body}
                                            attachments={
                                                letterData[i].attachments
                                                    ? letterData[i]
                                                        .attachments
                                                    : {}
                                            }
                                            action={letterData[i].action_id}
                                            confidentiality={
                                                letterData[i].confidentiality
                                            }
                                            category={
                                                letterData[i].category_id
                                            }
                                            priority={
                                                letterData[i].priority_id
                                            }
                                            regarding={letterData[i].regarding_info}
                                            according={true}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            ) : (
                                ""
                            )
                        )
                        : ""}

                    {Object.keys(letterData).length != 0
                        ? Object.keys(letterData).map((letter, i) =>
                            letterData[i].type == 0 ? (
                                <MailDetails
                                    subject={letterData[i].subject}
                                    author={letterData[i].author}
                                    create_date_time={
                                        letterData[i].create_date_time
                                    }
                                    recipient={letterData[i].recipient_names}
                                    isCopy={letterData[i].copies_names}
                                    body={letterData[i].body}
                                    attachments={
                                        letterData[i].attachments
                                            ? letterData[i].attachments
                                            : {}
                                    }
                                    action={letterData[i].action_id}
                                    confidentiality={
                                        letterData[i].confidentiality
                                    }
                                    category={letterData[i].category_id}
                                    priority={letterData[i].priority_id}
                                    regarding={letterData[i].regarding_info}
                                    letterNo={letterData[i].letter_no}
                                    originalUuid={router.query.id}
                                    according={false}
                                />
                            ) : (
                                ""
                            )
                        )
                        : ""}
                </main>
            </div>
            <div className="pt-2 pb-2 px-10 border-t border-gray-200">
                <div className="flex justify-end">
                    {user.id != letterData.author_id ? (
                        <>
                            <Link href={`/cartable/${router.query.id}/forward`}>
                                <button
                                    type="button"
                                    className="inline-flex justify-center py-2 px-4 ml-2  shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-[#a97e35] "
                                    >
                                    <span>ارجاع نامه</span>
                                </button>
                            </Link>
                            {letterData.letter_no ? null :
                                <Link href={`/cartable/${router.query.id}/reply`}>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 ml-2  shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-[#a97e35] "
                                    >
                                        <span>پاسخ نامه</span>
                                    </button>
                                </Link>}
                        </>
                    ) : (
                        ""
                    )}

                    <Link href={`${source == "arrived" ? "/cartable/sendList" : "/cartable/inbox"}`}>
                        <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4  shadow-sm text-sm font-medium rounded-md text-white bg-[#eb5757] hover:bg-[#843737] focus:outline-none "
                        >
                            <span>انصراف</span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
