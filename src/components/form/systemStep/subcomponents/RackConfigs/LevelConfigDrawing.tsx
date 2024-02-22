import { Box, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { TLevelsConfig, TLevelsDetails } from "../../../../../features/interfaces";

export default function LevelConfigDrawing({ levels }: { levels: TLevelsConfig['levels'] }) {
    const stageRef = useRef(null);
    const drawingScale = .1
    const theme = useTheme();

    useEffect(() => {
        if (stageRef.current) {
            //@ts-ignore
            stageRef.current.batchDraw();
        }
    }, [levels]);

    const uprightWidth = 85 * drawingScale;
    const highestLevel = (levels.map(level => level.height).slice(levels.length - 1)[0] * drawingScale);
    const uprightHeight = highestLevel + 25;
    const beamWidth = 2700 * drawingScale;
    const beamHeight = 130 * drawingScale
    const stageWidth = beamWidth + uprightWidth * 2
    const stageHeight = uprightHeight + 50

    const renderUpright1 = () => (
        <Rect x={0} y={0} width={uprightWidth} height={uprightHeight} fill="#004f7c" />
    );

    const renderUpright2 = () => (
        <Rect x={uprightWidth + beamWidth} y={0} width={uprightWidth} height={uprightHeight} fill="#004f7c" />
    );

    const renderPallet = (x: number, startHeight: number, palletHeight: number) => {
        console.log(highestLevel-(startHeight-25))
        return (
            <Rect x={x - 50} y={highestLevel-(startHeight-beamHeight-23.5)} width={100} height={palletHeight} fill="#ffd700" />
        );
    };

    const renderBeam = (index: number, level: TLevelsDetails) => {
        const { height, accessory } = level
        const scaledLevelHeight = height * drawingScale
        const prevLevelHeight = index > 0 ? levels[index - 1].height : 0;
        const palletHeight = (height - prevLevelHeight)*drawingScale - 25
        return (
            <>
                <Rect x={uprightWidth} y={uprightHeight - scaledLevelHeight - beamHeight} width={beamWidth} height={beamHeight} fill="#e88c00" />
                {renderPallet(uprightWidth + beamWidth / 2, scaledLevelHeight, palletHeight)}
                <Text x={uprightWidth} y={uprightHeight - scaledLevelHeight - beamHeight - 15} text={`${index + 1}: ${height.toString()} (${accessory})`} fontSize={14} fill={theme.palette.text.primary} align="center" />

            </>
        );
    }

    return (
        <Stage width={stageWidth} height={stageHeight} ref={stageRef} >
            <Layer class='dimensions'>
                <Line
                    points={[uprightWidth, uprightHeight + 30, uprightWidth + beamWidth, uprightHeight + 30]}
                    stroke={theme.palette.text.primary}
                    strokeWidth={2}
                />
                <Line
                    points={[uprightWidth, uprightHeight + 20, uprightWidth, uprightHeight + 40]}
                    stroke={theme.palette.text.primary}
                    strokeWidth={2}
                />
                <Line
                    points={[uprightWidth + beamWidth, uprightHeight + 20, uprightWidth + beamWidth, uprightHeight + 40]}
                    stroke={theme.palette.text.primary}
                    strokeWidth={2}
                />
                <Text
                    x={uprightWidth + 10}
                    y={uprightHeight + 10}
                    text={`Beam Width: ${(beamWidth * 10)}`}
                    fontSize={14}
                    fill={theme.palette.text.primary}
                    align="center"
                />
            </Layer>
            <Layer>
                {renderUpright1()}
                {renderUpright2()}
                {levels.map((level, index) => (
                    <Box key={index}>
                        {renderBeam(index, level)}
                    </Box>
                ))}
            </Layer>
        </Stage>
    );
};