import SupplyPikeStory from "../_components/stories/SupplyPikeStory";

interface StoryPageProps {
    params: Promise<{ slug: string }>;
}
const StoryPage = async ({ params }: StoryPageProps) => {
    const { slug } = await params;
    console.log('slug:', slug);

    if ( slug === "supplypike-internship" ) {
        return <SupplyPikeStory />
    } else {
        return (
            <h4 className="min-h-screen w-full flex-center text-text-primary tracking-widest">
                story not found
            </h4>
        )
    }
}

export default StoryPage