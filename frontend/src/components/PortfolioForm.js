import React from "react";
import NavBar from "./NavBar"
import Footer from "./Footer";
import TextField from '@mui/material/TextField';
import MultipleSelectChip from "./MultipleSelectChip";
import "../static/styles/portfolio-form.css"
import { Button } from "@mui/material";

const PortfolioForm = () => {
    return (
        <>
        <NavBar />
        <div className="portfolio-form">
            <form action="" method="POST">
                <h1>Create Portfolio</h1>
                
                {/* Email Field */}
                <TextField
                    required
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Enter Email"
                    helperText="Enter your Email Address"
                    fullWidth
                    InputLabelProps={{
                        shrink: true, // Always show the label when not focused
                    }}
                    sx={{ width: "95%", mb: 3 }} // Adds margin between fields
                />
                
                {/* LinkedIn Field */}
                <TextField 
                    id="linkedin"
                    name="linkedin"
                    placeholder="Enter LinkedIn Link"
                    helperText="Insert Your LinkedIn URL"
                    fullWidth
                    InputLabelProps={{
                        shrink: true, // Always show the label when not focused
                    }}
                    sx={{ width: "95%", mb: 3 }} // Adds margin between fields
                />
                <TextField 
                    id="github"
                    name="github"
                    placeholder="Enter GitHub URL"
                    helperText="Insert Your GitHub URL"
                    fullWidth
                    InputLabelProps={{
                        shrink: true, // Always show the label when not focused
                    }}
                    sx={{ width: "95%", mb: 3 }} // Adds margin between fields
                />
                <TextField 
                    id="hackerrank"
                    name="hackerrank"
                    placeholder="Enter Hackerrank URL"
                    helperText="Insert Your Hackerrank URL"
                    fullWidth
                    InputLabelProps={{
                        shrink: true, // Always show the label when not focused
                    }}
                    sx={{ width: "95%", mb: 3 }} // Adds margin between fields
                />
                <TextField 
                    id="leetcode"
                    name="leetcode"
                    placeholder="Enter LeetCode URL"
                    helperText="Insert Your LeetCode URL"
                    fullWidth
                    InputLabelProps={{
                        shrink: true, // Always show the label when not focused
                    }}
                    sx={{ width: "95%", mb: 3 }} // Adds margin between fields
                />
                <MultipleSelectChip />
                <Button className="cta-button" type="submit" variant="contained" size="large">Submit</Button>
            </form>
        </div>
        <Footer />
        </>
    );
}

export default PortfolioForm;
