import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import News from '@/components/News'

export default function Home() {
	const { data: session } = useSession()
	
	return (
		<Layout>
			<h3 className='font-medium text-2xl py-3'>
				<News/>
			</h3>
		</Layout>
	)
}
