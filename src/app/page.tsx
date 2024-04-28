import Link from 'next/link';

export default function Splash() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <Link href='/wall' className='text-xl'>
                Lets Go!
            </Link>
        </div>
    );
}
