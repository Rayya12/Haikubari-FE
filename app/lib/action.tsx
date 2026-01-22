'use server'

import { error } from "console"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"


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

    if (isNaN(age) || !Number.isInteger(age) || age < 1 || age >= 200) {
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
  
    const responseRegist = await fetch(`${backendURL}/auth/register`,{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
            body:JSON.stringify(payload)
        })

        if (!responseRegist.ok){
            return {error:"登録が失敗しました"}
        }
    

    const body = new URLSearchParams();
    body.set("username",email)
    body.set("password",password)
    const response = await fetch(`${backendURL}/auth/jwt/login`,{
        method : "POST",
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body:body.toString()
    })
    
    if (!response.ok){
        return {error:"登録が失敗しました"}
    }


    const data = await response.json();

    const kukis = await cookies()

    kukis.set("access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    });

    const otp = await requestOTP(email);

    redirect(`/verify-otp?email=${email}`)
}

export async function handleVerifyOTP(prevState:{error?:string},formData:FormData) {
    const one = Number(formData.get("one"));
    if (isNaN(one) || one < 0 || one > 9){
        return {error:"正しいOTPを入れて下さい"}
    }

    const two = Number(formData.get("two"));
    if (isNaN(two) || two < 0 || two > 9){
        return {error:"正しいOTPを入れて下さい"}
    }

    const three = Number(formData.get("three"));
    if (isNaN(three) || three < 0 || three > 9){
        return {error:"正しいOTPを入れて下さい"}
    }

    const four = Number(formData.get("four"));
    if (isNaN(four) || four < 0 || four > 9){
        return {error:"正しいOTPを入れて下さい"}
    }

    const five = Number(formData.get("five"));
    if (isNaN(five) || five < 0 || five > 9){
        return {error:"正しいOTPを入れて下さい"}
    }

    const six = Number(formData.get("six"));
    if (isNaN(six) || six < 0 || six > 9){
        return {error:"正しいOTPを入れて下さい"}
    }

    const onestr = one.toString()
    const twostr = two.toString()
    const threestr = three.toString()
    const fourstr = four.toString()
    const fivestr = five.toString()
    const sixstr = six.toString()

    const finalOtp = onestr+twostr+threestr+fourstr+fivestr+sixstr

    const verifyOtp = await verifyOtpAction(finalOtp)

    if (!verifyOtp.ok){
        return {error:"正しいOTPを入れて下さい"}
    }

    redirect(`verify-otp/success`)


}

export async function requestOTP(email:string){
    const responseOtp = await fetch(`${backendURL}/auth/otp/request`,{
        method:"POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify({email})
    }) 

    if (!responseOtp.ok) {
        return { ok: false as const, error: "request otp failed" };
    }

    const data = (await responseOtp.json()) as { ok: boolean };
    return data.ok ? { ok: true as const } : { ok: false as const, error: "not ok" };
}



export async function verifyOtpAction(code: string) {
  const cookieStore = await cookies();

  // forward cookie JWT ke backend
  const access = cookieStore.get("access_token")?.value;

  const res = await fetch(`${backendURL}/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(access ? { cookie: `access_token=${access}` } : {}),
    },
    body: JSON.stringify({ code }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false as const, error: err.detail ?? "OTP invalid" };
  }

  return (await res.json()) as {
    ok: true;
    is_verified: true;
  };
}

