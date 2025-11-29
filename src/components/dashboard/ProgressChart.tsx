import { useEffect, useRef } from 'react';
interface ChartData {
  labels: string[];
  values: number[];
}
interface ProgressChartProps {
  data: ChartData;
  title: string;
}
const ProgressChart = ({ data, title }: ProgressChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;
    const barWidth = chartWidth / data.labels.length - 10;
    const maxValue = Math.max(...data.values, 10); 
    ctx.beginPath();
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-purple-300');
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, rect.height - padding);
    ctx.lineTo(rect.width - padding, rect.height - padding);
    ctx.stroke();
    
    data.values.forEach((value, index) => {
      const x = padding + index * (barWidth + 10);
      const barHeight = (value / maxValue) * chartHeight;
      const y = rect.height - padding - barHeight;
      
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-pink-700');
      ctx.fillRect(x, y, barWidth, barHeight);
      
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-purple-700');
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[index], x + barWidth / 2, rect.height - padding + 15);
      ctx.fillText(`${value}%`, x + barWidth / 2, y - 10);
    });
    
  }, [data]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="h-64">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
};
export default ProgressChart;
