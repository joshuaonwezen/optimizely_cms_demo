// import { FragmentType, useFragment } from '../../graphql/fragment-masking'
// import { graphql } from '@/graphql'

// export const FooterElementFragment = graphql(/* GraphQL */ `
//     fragment footerElement on FooterElement {
//         Text {
//             html
//         }
//     }
// `)

// const FooterElementComponent = (props: {
//     footerElement: FragmentType<typeof FooterElementFragment>
// }) => {
//     const footerElement = useFragment(FooterElementFragment, props.footerElement)
//     // @ts-ignore
//     return <div dangerouslySetInnerHTML={{ __html: footerElement.Text?.html }}></div>
// }

// export default FooterElementComponent