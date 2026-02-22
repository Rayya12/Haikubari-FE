import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans" style={{backgroundImage:`url(/backgroundHome.png)`}}>
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-20">
        {/* Hero */}
        <div className="flex w-full flex-col-reverse items-center justify-between gap-10 md:flex-row">
          {/* Left: Text */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="relative w-[150px] h-[50px] overflow-hidden">
            <Image
              src="/blacklogo.png"
              alt="haikubari logo"
              fill
              className="object-cover"

            />
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
              今を大切に
              <br />
              俳句を作る
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              ひとことに、気持ちを込めて。俳句張りで俳句を作って、共有して、楽しもう。
            </p>

            {/* Actions */}
            <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="flex h-12 w-full items-center justify-center rounded-full bg-lime-green px-6 text-base font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-[170px]"
              >
                ログイン
              </Link>

              <Link
                href="/register"
                className="flex h-12 w-full items-center justify-center rounded-full bg-ateneo-blue px-6 text-base font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-[170px]"
              >
                新規登録
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="flex w-full max-w-sm items-center justify-center md:max-w-md">
            <Image
              src="/HaikubariMan.png"
              alt="Haikubari Hero"
              width={420}
              height={420}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
