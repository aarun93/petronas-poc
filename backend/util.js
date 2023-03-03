export function getDrawText(prompt,color,size,x_pos,y_pos,input,output) {
  return {
    filter: "drawtext",
    options: {
      fontfile: "./assets/fonts/TiltWarp-Regular.ttf",
      text: prompt,
      fontcolor: "white",
      fontsize: "80",
      alpha:
        "if(lt(t,0),0,if(lt(t,0.5),(t-0)/0.5,if(lt(t,2.5),1,if(lt(t,3),(0.5-(t-2.5))/0.5,0))))",
      x: "(w-text_w)/2",
      y: "(h-text_h)/2",
    },
    inputs: "0:v",
    outputs: "powermoment1",
  };
}