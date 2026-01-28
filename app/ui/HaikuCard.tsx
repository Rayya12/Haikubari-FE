import Link from "next/link"


export default function HaikuCard(props: {id:string,title:string,line1:string,line2:string,line3:string}){
    return (
    <div className="flex flex-col border border-gray-300 rounded-lg p-4 m-2 bg-white shadow-md w-[280px]">
        <div className="bg-teal-Deer text-black text-center font-bold rounded-md mb-4 p-2">{props.title}</div>
        <p className="text-black">{props.line1}</p>
        <p className="text-black">{props.line2}</p>
        <p className="text-black">{props.line3}</p>

        <div className="flex w-full justify-center">
            <Link href={`/dashboard/common/haiku/${props.id}`} className="bg-teal mt-4 w-1/2 text-center font-bold text-white rounded-md p-2">もっと見る</Link>
        </div>
        
        
    </div>)

    }