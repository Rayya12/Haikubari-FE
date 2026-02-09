'use server'

import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import {getByIDResponse, Haiku, ImageKitAuthResponse, MyHaikusResponse,Review,reviewResponse, userResponse} from "./type"
import { AsyncCallbackSet } from "next/dist/server/lib/async-callback-set"
import { resolve } from "path"
import { json } from "stream/consumers"
import { error } from "console"


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

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

    const responseCheck = await fetch(`${backendURL}/auth/otp/check`,{
        method : "DELETE",
        headers : {
            'Content-Type' : 'application/json'   
        },
        body:JSON.stringify({username:username,email:email})
    })
  
    const responseRegist = await fetch(`${backendURL}/auth/register`,{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
            body:JSON.stringify(payload)
        })

        if (!responseRegist.ok) {
            return { error: "ユーサネーム/メールアドレスが存在しました"}
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
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${backendURL}/auth/otp/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
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

export async function  handleLogin(prevState:{error?:String} | null,formData:FormData) {
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()

    if (!email) {
        return {error:"メールアドレスを入れて下さい"}
    }

    if (!password) {
        return {error:"パスワードを入れて下さい"}
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
        return {error:"ユーサネーム/パスワードが間違いました"}
    }

    const data = await response.json()

    const kukis = await cookies()
    kukis.set("access_token",data.access_token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"lax",
        path:"/"
    })

    redirect("/dashboard")   
}

export async function handleLogout(){
    const kukis = await cookies()
    const ctoken = kukis.get("access_token")?.value

    const logout = await fetch(`${backendURL}/auth/jwt/logout`,{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${ctoken}`
        }
    })

    
    kukis.delete("access_token");
    redirect("/login")
}

export async function handleCreateHaiku(prevState:{error?:string} | null,formData:FormData) {
    const title = formData.get("title")?.toString();
    if (!title || title.trim() === "") {
        return { error: "タイトルを入れて下さい" };
    }

    const hashigo = formData.get("line1")?.toString();
    if (!hashigo || hashigo.trim() === "") {
        return { error: "第一行を入れて下さい" };
    }
    if (hashigo.length > 5){
        return { error: "第一行は五文字まで入れて下さい" };
    }

    const nakasichi = formData.get("line2")?.toString();
    if (!nakasichi || nakasichi.trim() === "") {
        return { error: "第二行を入れて下さい" };
    }
    if (nakasichi.length > 7){
        return { error: "第二行は七文字まで入れて下さい" };
    }

    const shimogo = formData.get("line3")?.toString();
    if (!shimogo || shimogo.trim() === "") {
        return { error: "第三行を入れて下さい" };
    }
    if (shimogo.length > 5){
        return { error: "第三行は五文字まで入れて下さい" };
    }


    const description = formData.get("description")?.toString();

    const kukis = await cookies();
    const ctoken = kukis.get("access_token")?.value;

    const response = await fetch(`${backendURL}/haikus/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ctoken}`
        },
        body: JSON.stringify({
            title,
            hashigo,
            nakasichi,
            shimogo,
            description
        })
    });

    if (!response.ok) {
        return { error: "俳句の投稿に失敗しました" };
    }

    redirect("/dashboard/common/haiku/mine");
}

type GetMyHaikusParams = {
  page?: number;
  page_size?: number;
  q?: string;
  sort?: "created_at" | "likes";
  order?: "asc" | "desc";
};

export async function getMyHaikus(params: GetMyHaikusParams = {}): Promise<MyHaikusResponse> {
  const kukis = await cookies();
  const ctoken = kukis.get("access_token")?.value;

  if (!ctoken) {
    throw new Error("No access token (not logged in?)");
  }

  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  if (params.q) search.set("q", params.q);
  if (params.sort) search.set("sort", params.sort);
  if (params.order) search.set("order", params.order);


  const url = `${backendURL}/haikus/my-haikus?${search.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ctoken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Failed to fetch haikus (${response.status}): ${errText}`);
  }

  const data = (await response.json()) as MyHaikusResponse;
  return data;
}

export async function getAllHaikus(params:GetMyHaikusParams = {}): Promise<MyHaikusResponse> {
    const kukis = await cookies();
    const ctoken = kukis.get("access_token")?.value;

    if (!ctoken){
        throw new Error("no access token (not logged in?)")
    }

    const search = new URLSearchParams();

    if (params.page) search.set("page",String(params.page))
    if (params.page_size) search.set("page_size",String(params.page_size))
    if (params.q) search.set("q",params.q)
    if (params.sort) search.set("sort",params.sort)
    if (params.order) search.set("order",params.order)
    
    const url = `${backendURL}/haikus?${search.toString()}`;

    const response = await fetch(url,{
        method:"GET",
        headers:{
            Authorization: `Bearer ${ctoken}`,
        },
        cache:"no-store"
    })

    if (!response.ok){
        const errtext = await response.text().catch(()=>"")
        throw new Error(`Failed to fetch haikus (${response.status}): ${errtext}`)
    }

    const data = (await response.json()) as MyHaikusResponse;

    return data;

   
}

export async function getHaikuById(id:string) {
    const kukis = await cookies()
    const ctoken = kukis.get("access_token")?.value

    if (!ctoken){
        throw new Error("no access token (not logged in?)")
    }
    
    const response = await fetch(`${backendURL}/haikus/${id}`,{
        method :"GET",
        headers : {
            Authorization : `Bearer ${ctoken}`
        },
        cache: "no-store"
    })

    if (!response.ok){
        const errtext = await response.text().catch(()=>"")
        throw new Error(`Failed to fetch haikus (${response.status}): ${errtext}`)
    }

    const data = (await response.json()) as getByIDResponse ;
    return data;

    
}

export async function likes(haiku_id:string) {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value;

    const response = await fetch(`${backendURL}/haikus/${haiku_id}/likes`,{
        method : "PATCH",
        headers : {
            Authorization: `Bearer ${cToken}`
        }
    })

    if (!response.ok){
        const errText = await response.text().catch(()=>"")
        throw new Error(`Failed to likes haikus (${response.status}):${errText}`)
    }

    return "ok"
}

export async function unlikes(haiku_id:string) {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value;

    const response = await fetch(`${backendURL}/haikus/${haiku_id}/unlikes`,{
        method : "DELETE",
        headers : {
            Authorization: `Bearer ${cToken}`
        }
    })

    if (!response.ok){
        const errText = await response.text().catch(()=>"")
        throw new Error(`Failed to likes haikus (${response.status}):${errText}`)
    }

    return "ok"
}

export async function getIsLikes(id:string) {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value;

    const response = await fetch(`${backendURL}/likes/${id}`,{
        method : "GET",
        headers: {
            Authorization : `Bearer ${cToken}`
        }
        
    })

    if (!response.ok){
        return false as Boolean;
    }

    return true as Boolean;
}

export async function  getReview(id:string) {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value;

    const response = await fetch(`${backendURL}/reviews/${id}`,{
        method:"GET",
        headers : {
            Authorization :`Bearer ${cToken}`
        }
    })

    if (!response.ok){
        const errtext = await response.text().catch(()=>"")
        throw Error(`Error with status code (${response.status}):${errtext}`)
    }

    const data = (await response.json()) as reviewResponse;

    return data;
}

export async function createReview(prevState : {error? :string}, formData : FormData) {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value;

    const reviewCreate = {
        haiku_id : formData.get("id"),
        content : formData.get("content")
    }

    console.log(reviewCreate)

    const response = await fetch(`${backendURL}/reviews/create`,{
        method:"POST",
        headers : {
            'Content-Type' : 'application/json' ,
            Authorization : `Bearer ${cToken}`
        },
        body: JSON.stringify(reviewCreate)
    })

    if (!response.ok){
        return {error : "レビューを作ることができません"}
    }

    redirect(`/dashboard/common/haiku/${formData.get("id")}`)
}

export async function handleDeleteHaiku(id:string){
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value

    const response = await fetch(`${backendURL}/haikus/${id}`,{
        method : "DELETE",
        headers : {
            Authorization : `Bearer ${cToken}`
        }
    })

    redirect("/dashboard/common/haiku/mine")

}

export async function handleEditHaiku(prevState : {error? :string}, formData : FormData){
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value

    const id = formData.get("id")?.toString();
    if (!id){
        return {error:"IDが見つかりません"}
    }

    const title = formData.get("title")?.toString();
    if (!title || title.trim() === "") {
        return { error: "タイトルを入れて下さい" };
    }

    const hashigo = formData.get("line1")?.toString();
    if (!hashigo || hashigo.trim() === "") {
        return { error: "第一行を入れて下さい" };
    }
    if (hashigo.length > 5){
        return { error: "第一行は五文字まで入れて下さい" };
    }

    const nakasichi = formData.get("line2")?.toString();
    if (!nakasichi || nakasichi.trim() === "") {
        return { error: "第二行を入れて下さい" };
    }
    if (nakasichi.length > 7){
        return { error: "第二行は七文字まで入れて下さい" };
    }

    const shimogo = formData.get("line3")?.toString();
    if (!shimogo || shimogo.trim() === "") {
        return { error: "第三行を入れて下さい" };
    }
    if (shimogo.length > 5){
        return { error: "第三行は五文字まで入れて下さい" };
    }

    const description = formData.get("description")?.toString();

    const request = {
        title : title,
        hashigo : hashigo,
        nakasichi : nakasichi,
        shimogo : shimogo,
        description :description
    }


    const response = await fetch(`${backendURL}/haikus/${id}/edit`,
        {
            method : "PATCH",
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${cToken}`
            },
            body : JSON.stringify(request)
        }
    )

    if (!response.ok){
        return {error:"俳句を編集することができません"}
    }

    redirect(`/dashboard/common/haiku/${id}`)
}


export async function getMe() {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value
    
    const response = await fetch(`${backendURL}/users/me`,{
        method : "GET",
        headers : {
            Authorization : `Bearer ${cToken}`}
    })

    if (!response.ok){
        throw Error("ユーザーが見つかりませんでした")
    }

    return (await response.json()) as userResponse

    
}

export async function PatchMe(username:string,photo_url:String,file_name:string,file_type:string,bio:string,age:string,address:string) {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value

    const request = {
        username : username,
        photo_url : photo_url,
        file_name : file_name,
        file_type : file_type,
        bio : bio,
        age : Number(age),
        address : address
    }

    console.log(request)
    
    const response = await fetch(`${backendURL}/users/me`,{
        method : "PATCH",
        headers : {
            Authorization : `Bearer ${cToken}`,
            'Content-Type' : 'application/json' 
        },
        body: JSON.stringify(request)
    })

    if (!response.ok){
        const errtext = response.text().catch(()=>"")
        throw Error(`error happen with status code${response.status}:${errtext}`)
    }

    return (await response.json()) as userResponse

    
}


export async function auth() {
    const kukis = await cookies();
    const cToken = kukis.get("access_token")?.value

    const response = await fetch(`${backendURL}/imagekit/auth`,{
        method : "GET",
        headers : {
            Authorization : `Bearer ${cToken}`
        }
    })

    if (!response.ok){
        throw Error("認証が失敗しました")
    }
    
    const data = await response.json() as ImageKitAuthResponse

    return data
}