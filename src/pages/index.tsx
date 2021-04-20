// Exemplo das formas de consumo de API
// SPA 
// SSR
// SSG

import { useEffect } from "react"

export default function Home(props) {

    // Forma tradicional de realizar chamadas
    // useEffect(() => {
    //     fetch('http://localhost:3333/episodes')
    //         .then(response => response.json())
    //         .then(data => console.log(data))
    // }, []);

    // Forma utilizando SSR


    return (
        <div>
            <h1>Index</h1>
            <p>{JSON.stringify(props.episodes)}</p>
        </div>
    )
}

// chamada a api usando SSR
// export async function getServerSideProps()
// {
//     const response = await fetch('http://localhost:3333/episodes');
//     const data = await response.json();

//     return {
//         props: {
//             episodes: data
//         }
//     }
// }

// chamada a api usando SSG
export async function getStaticProps()
{
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();

    return {
        props: {
            episodes: data
        },
        revalidate: 60 * 60 * 8
    }
}