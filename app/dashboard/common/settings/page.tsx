import { User,Home} from "lucide-react"
import Link from "next/link"

export default function setting(){

    const menu = [
    {href:"/dashboard/common/settings/profile",label:"プロファイル",icon:User},
    {href:"/dashboard/common/",label:"ホームページ",icon:Home}
    ]

    return <div className="min-h-screen w-full bg-white p-8">
        <h1 className="text-4xl font-bold text-ateneo-blue">プロファイル</h1>
        <ul className="flex flex-col mt-8 w-full space-y-2">
            {menu.map((decision)=>{
                const Icon = decision.icon;
                return (<li key={decision.label}>
                            <Link className="flex bg-lime-green hover:bg-green-800 text-xl w-full text-white font-bold rounded-md h-full px-3 py-4 items-center" href={decision.href}>
                            <Icon className="w-5 h-5" strokeWidth={2.2} />
                            <span>{decision.label}</span></Link>
                        </li>)
            })}
        </ul>
    </div>
}