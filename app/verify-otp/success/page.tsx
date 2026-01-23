import Image from "next/image"
import Link from "next/link"

export default function showSuccess(){
    return(
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: 'url(/loginBackground.png)' }}>
        <div className="flex flex-col w-full sm:w-3/4 lg:w-1/2 bg-white shadow-md rounded-md border border-gray-300 items-center justify-center px-4 py-8 space-y-4">
            <Image src={"/OTPVerif.png"} alt="メールアドレス確認せいこうしました！" width={300} height={300}/>
            <p className="text-center font-bold text-black text-xl">メールアドレス確認がせいこうしました！ログイン場面へお戻りください</p>
            <Link className="mt-2 w-full max-w-sm flex items-center justify-center p-2 bg-lime-green shadow-md rounded-md font-bold
    text-white" href={"/login"}>ログイン場面へ</Link>
        </div>
    </div>)
}