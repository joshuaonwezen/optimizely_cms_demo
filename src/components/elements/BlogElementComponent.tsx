import { FragmentType, useFragment } from "../../graphql/fragment-masking";
import { graphql } from "@/graphql";

export const BlogElementFragment = graphql(/* GraphQL */ `
  fragment blogElement on BlogElement {
    Author
    Image {
      default
    }
    Text {
      html
    }
    Title
  }
`);

const BlogElementComponent = (props: {
    blogElement: FragmentType<typeof BlogElementFragment>
}) => {
    const blogElement = useFragment(BlogElementFragment, props.blogElement);

    return (
        <article className="max-w-3xl mx-2 my-8 p-8 bg-[#1a1736] rounded-lg shadow-lg border border-[#3a2c98] text-[#e4e2f5]">
            <h1 className="text-3xl font-bold mb-3">{blogElement.Title}</h1>
            
            {blogElement.Author && (
                <p className="text-sm font-medium text-[#b3a7ff] mb-5">By {blogElement.Author}</p>
            )}
            
            {blogElement.Image?.default && (
                <div className="w-full mb-6">
                    <img
                        src={blogElement.Image.default}
                        alt={blogElement.Title || "Blog image"}
                        className="w-full h-auto rounded-lg object-cover shadow-md border border-[#3a2c98]"
                    />
                </div>
            )}
            
            {blogElement.Text?.html && (
                <div
                    className="prose prose-lg text-[#e4e2f5] prose-headings:text-[#a899ff] prose-a:text-[#b3a7ff] prose-strong:text-[#d0c6ff]"
                    dangerouslySetInnerHTML={{ __html: blogElement.Text.html }}
                />
            )}
        </article>
    );
};


export default BlogElementComponent;
