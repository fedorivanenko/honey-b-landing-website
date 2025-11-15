import Link from "next/link";
import Logo from '@/components/icons/logo.svg'
import LinkedIn from '@/components/icons/linkedin.svg'
import Twitter from '@/components/icons/twitter.svg'
import Telegram from '@/components/icons/telegram.svg'

export default function Footer() {
  return (
    <footer className="mb-20 mt-50 sm:mt-75 text-muted-foreground">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full lg:items-end space-y-20 sm:space-y-0">
        <div className="flex flex-col space-y-11.5">
          <Logo className="w-[278px] h-[66px]" />
        <p className="max-w-120">
          HoneyB is a digital asset platform. Use involves risk, including
          possible loss of funds. Services are provided “as&nbsp;is” without
          warranties, and HoneyB is not liable for any&nbsp;losses.
        </p>
        </div>
        <div className="flex flex-col space-y-6">
          <div className="flex gap-7.5">
            <Link href="/">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="/">
              <LinkedIn className="w-5 h-5" />
            </Link>
            <Link href="/">
              <Telegram className="w-5 h-5" />
            </Link>
          </div>
          <p>Copyright © 2025 HoneyB</p>
        </div>
      </div>
    </footer>
  );
}
