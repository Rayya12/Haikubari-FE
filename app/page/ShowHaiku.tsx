import { getHaikuById } from "../lib/action"

export default function ShowHaiku(props : {id:string}){
    const haiku = getHaikuById(props.id);
    
    return (
        <div></div>
    )

}