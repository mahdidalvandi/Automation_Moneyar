import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "@emotion/styled";
import axios from "../../lib/axios";

const StyledNode = styled.div`
    padding: 5px;
    border-radius: 8px;
    display: inline-block;
    border: 1px solid #1f2837;
`;

function Organizational({ data }) {
    const [chart, setChart] = useState([]);

    useEffect(() => {
        axios.post('/api/v1/company/post/chart',
            {
                uuid: data
            }).then((res) => {
                setChart([res.data.data]);
            })
    }, []);

    return (
        <Tree
            lineWidth={"2px"}
            length={"3"}
            lineColor={"#1f2837"}
            lineBorderRadius={"10px"}
            label={<StyledNode>{chart.length > 0 ? chart[0].company_title : ""}</StyledNode>}
        >
            {chart.map((item, index) => {
                return (
                    <TreeNode
                        key={index}
                        label={item.employees.length > 0 ?
                            <StyledNode>
                                {
                                    item.employees[0].first_name +
                                    " " +
                                    item.employees[0].last_name +
                                    " - " + item.title}
                            </StyledNode> : null
                        }
                    >
                        {item.sub_moderate.length > 0 &&
                            item.sub_moderate.map((em, em_ind) => {
                                return (
                                    <Item data={em} />)
                            })}
                    </TreeNode>
                );
            })}
        </Tree>
    );
}

const Item = ({ data }) => {

    return (
        <>
            {data.employees.length > 0 &&
                data.employees.map((em, em_ind) => {
                    return (
                        <TreeNode
                            key={em_ind}
                            label={
                                <StyledNode>
                                    {em.first_name +
                                        " " +
                                        em.last_name +
                                        " - " +
                                        data.title}
                                </StyledNode>
                            }
                        >
                            {data.sub_moderate.length > 0 ?
                                data.sub_moderate.map((em, em_ind) => {
                                    return (
                                        <TreeNode key={em_ind}>
                                            <Item data={em} />
                                        </TreeNode>
                                    );
                                }) : null}
                        </TreeNode>
                    );
                })}
        </>
    );
};
export default Organizational;
