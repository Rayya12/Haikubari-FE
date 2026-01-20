
import {noto} from "@/app/ui/font"
import Form from 'next/form'

export default function register(){

    async function  handleRegister(formData:FormData) {
        'use server'   
    }

    return(
            <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{backgroundImage:'url(/loginBackground.png)'}}>
                <div className="flex flex-col w-full sm:w-3/4 lg:w-1/2 bg-white shadow-md rounded-md border border-gray-300 items-center justify-center px-4 py-8 space-y-4">
                    <p className="text-black font-bold text-2xl">新しいアカウントを作る</p>
                    <Form action={handleRegister} className="flex flex-col w-full justify-center items-center">

                        <div className="flex mb-1 text-left w-3/4 text-black font-bold">
                            <label htmlFor="username" >ユーザー</label>
                        </div>
                        <input type="text" id="username" name="username" placeholder="ユーザー" className="text-black text-md border w-3/4 border-gray-300 p-2 focus:outline-2 focus:outline-ateneo-blue rounded-md mb-2"/>

                        <div className="flex mb-1 text-left w-3/4 text-black font-bold">
                            <label htmlFor="email" >メール</label>
                        </div>
                        <input type="email" id="email" name="email" placeholder="ohayou@example.com" className="text-black text-md border w-3/4 border-gray-300 p-2 focus:outline-2 focus:outline-ateneo-blue rounded-md mb-2"/>

                        <div className="flex mb-1 text-left w-3/4 text-black font-bold">
                            <label htmlFor="password" >パスワード</label>
                        </div>
                        <input type="password" id="password" name="password" placeholder="******" className="text-black text-md border w-3/4 border-gray-300 p-2 focus:outline-2 focus:outline-ateneo-blue rounded-md mb-2"/>

                        <div className="flex mb-1 text-left w-3/4 text-black font-bold">
                            <label htmlFor="age" >メール</label>
                        </div>
                        <input type="number" id="age" name="age" placeholder="17" className="text-black text-md border w-3/4 border-gray-300 p-2 focus:outline-2 focus:outline-ateneo-blue rounded-md mb-2"/>

                        <div className="flex mb-1 text-left w-3/4 text-black font-bold">
                            <p>役</p>
                        </div>

                        <div className="w-3/4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <input type="radio" name="role" value="common" className="accent-black"/> <span className="text-black">一般</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="radio" name="role" value="wacher" className="accent-black" /> <span className="text-black">監視者</span>
                            </div>
                        </div>


                        <button type="submit"></button>
                    </Form>
                    
                </div>
            </div>
        
    )
}