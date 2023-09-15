import { styled } from "@mui/material/styles";
import { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "../../lib/axios";

export default function Activation(props) {
  const { color, text, style, isActive, uuid } = props;

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  const handleChange = async () => {
    const UserFormData = new FormData();
    UserFormData.append("employee_uuid", uuid);

    if (isActive) {
      try {
        const response = await axios({
          method: "post",
          url: "/api/v1/user/disable",
          data: UserFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.status == 200) {
          window.location.reload();
        }
      } catch (error) {}
    } else {
      try {
        const response = await axios({
          method: "post",
          url: "/api/v1/user/enable",
          data: UserFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.status == 200) {
          window.location.reload();
        }
      } catch (error) {}
    }
  };

  return (
    <FormControlLabel
      control={
        <IOSSwitch
          sx={{ mb: 1.5 }}
          onChange={handleChange}
          checked={props.isActive}
          disabled={props.himself}
        />
      }
    />
  );
}
