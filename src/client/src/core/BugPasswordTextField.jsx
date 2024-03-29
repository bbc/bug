import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

export default function BugPasswordTextField({ variant = "standard", allowShowPassword = true, sx = {}, ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            variant={variant}
            sx={
                variant === "outlined"
                    ? {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          "& .MuiInputBase-root": {
                              borderRadius: 0,
                          },
                          "& .MuiInputBase-input": {
                              padding: "14px",
                          },
                          ...sx,
                      }
                    : sx
            }
            {...props}
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            InputProps={{
                endAdornment: allowShowPassword && (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}
