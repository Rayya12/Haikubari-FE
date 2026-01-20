'use server'

import { error } from "console"

const backendURL = process.env.BACKEND_URL

// Register action
export async function  handleRegister(prevState : {error?:string} | null,formData:FormData) {

    // get the data
    const username = formData.get('username')?.toString()
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()
    const age = Number(formData.get('age'))
    const role = formData.get("role")?.toString()

    // username regex
    const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
    const passwordRegex = /^.{8,12}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!username){
        return {error:"ユーサネームを入れて下さい"}
    }

    if (!usernameRegex.test(username)){
        return {error:"ユーサネームは文字と数字のみ"}
    }

    if (!email){
        return {error:"メールアドレスを入れて下さい"}
    }

    if (!emailRegex.test(email)){
        return {error:"ちゃんとしたメールアドレスを入れて下さい"}
    }



    if (!password){
        return {error:"パスワードを入れて下さい"}
    }

    if (!passwordRegex.test(password)){
        return {error:"パスワードは八文字から十二文字まで入れて下さい"}
    }

    if (!age){
        return {error:"年齢を入れて下さい"}
    }

    if (isNaN(age) || !Number.isInteger(age) || age <= 1 || age >= 200) {
        return { error: "年齢は一から二百まで入れて下さい" };
    }

    if (!role){
        return {error:"役を入れて下さい"}
    }

    const payload = {
        username : username,
        email:email,
        password:password,
        age:age,
        role:role,
        is_active:true,
        is_verified:false,
        is_superuser:false
    }


    try {
        const response = await fetch(`${backendURL}/auth/register`,{
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify(payload)
        })
    }catch(e){
        return {error:e}
    }


    return {error:undefined}




}
