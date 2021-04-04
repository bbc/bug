import React, { useEffect, useRef } from "react";

export default function MainPanel(props) {

    const canvasRef = useRef(null);
    let ctx = null
    let radius = null
    
    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        ctx.strokeStyle = 'rgba(255, 255, 255)';
        radius = canvas.height / 2;
        ctx.translate(radius, radius);
        radius = radius * 0.9;

        drawClock();
        setInterval(drawClock,500);
    },[]);

    const drawClock = () => {
      drawFace(ctx, radius);
      drawNumbers(ctx, radius);
      drawTime(ctx, radius);
    }

    const drawFace = () => {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2*Math.PI);
      ctx.fillStyle = 'rgba(38, 38, 38)';
      ctx.fill();

      ctx.lineWidth = radius*0.03;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
      ctx.fillStyle = 'rgb(204,204,204)';
      ctx.fill();
    }

    const drawNumbers = (ctx, radius) => {
      let ang;
      let num;
      ctx.font = radius*0.15 + "px arial";
      ctx.textBaseline="middle";
      ctx.textAlign="center";
      ctx.textColor = 'rgb(204,204,204)';
      for(num = 1; num < 13; num++){
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
      }
    }

    const drawTime = (ctx, radius) => {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        
        //hour
        hour=hour%12;
        hour=(hour*Math.PI/6)+
        (minute*Math.PI/(6*60))+
        (second*Math.PI/(360*60));
        drawHand(ctx, hour, radius*0.5, radius*0.05);
        
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        drawHand(ctx, minute, radius*0.8, radius*0.05);
        
        // second
        second=(second*Math.PI/30);
        drawHand(ctx, second, radius*0.9, radius*0.02);
    }

    const drawHand = (ctx, pos, length, width) => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(204,204,204)';
        ctx.lineWidth = width;
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    return (
      <React.Fragment>
        <canvas width={window.innerHeight*0.76} height={window.innerHeight*0.76} ref={canvasRef} />
      </React.Fragment> 
    );
}
