import { use, useEffect, useState } from "react";
import { getHaikuById } from "../lib/action"
import { Haiku } from "../lib/type";
import { Divide } from "lucide-react";

export default function ShowHaiku(props : {id:string}){
    const [haiku,setHaiku] = useState<Haiku|null>(null)
    const [err,setErr] = useState<string>("")
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        async function run() {
            setLoading(true)
            try{
                const data = await getHaikuById(props.id);
                setHaiku(data)
            }catch(e:any){
                setErr(e?.message ?? "failed to load")
            }finally{
                setLoading(false)
            }
        }
        run()
        
    },[props.id])

    return(
        <>

        {loading && <div>
            loding dulu ges
            </div>}

        {  !loading &&
        <div>
            <p>{haiku?.id}</p>
            <p>{haiku?.hashigo}</p>
            <p>{haiku?.nakasichi}</p>
            <p>{haiku?.shimogo}</p>
        </div>
        }
        </>
    )
}