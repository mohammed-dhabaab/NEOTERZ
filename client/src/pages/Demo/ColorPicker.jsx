import { Tooltip } from '@mui/material'

const ColorPicker = ({ title, color, onChange }) => {
    return (
        <Tooltip title={title} className="transition-all duration-500 ease-in-out bg-gray-400 appearance-none border-0 cursor-pointer rounded-xl hover:bg-gray-200" arrow enterDelay={700} leaveDelay={100}>
            <input
                type="color"
                className="appearance-none border-0 w-12 h-6 px-1 cursor-pointer rounded-full"
                value={color}
                onChange={(e) => onChange(e.target.value)}
            />
        </Tooltip>
    )
}

export default ColorPicker