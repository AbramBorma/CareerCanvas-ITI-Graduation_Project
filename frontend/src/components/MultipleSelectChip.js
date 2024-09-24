import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const skills = [
  'PHP',
  'Python',
  'MySQL',
  'JavaScript',
  'Operating Systems',
  'Bash Scripting',
  'Linux',
  'React.js',
  'Angular',
  'MongoDB',
];

function getStyles(skill, selectedSkills, theme) {
  return {
    fontWeight: selectedSkills.includes(skill)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelectChip() {
  const theme = useTheme();
  const [selectedSkills, setSelectedSkills] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSkills(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl fullWidth sx={{ mb: 3, width: '95%' }}>
      <InputLabel id="demo-multiple-chip-label">Select Skills</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={selectedSkills}
        onChange={handleChange}
        input={<OutlinedInput label="Select Skills"/>}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
        sx={{
          backgroundColor: '#f4f7f8', // Match other fields' background
          padding: '10px',          // Adjust padding to match TextField
        }}
      >
        {skills.map((skill) => (
          <MenuItem
            key={skill}
            value={skill}
            style={getStyles(skill, selectedSkills, theme)}
          >
            {skill}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
