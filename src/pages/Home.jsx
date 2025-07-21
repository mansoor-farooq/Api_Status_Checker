import Layout from '../component/Layout';
import RecentActivities from '../component/RecentActivities';

const HomePage = () => {
    return (
        <Layout>
            {/* <div className="min-h-screen bg-gray-50"> */}
            <div className="min-h-screen bg-gray-50 pt-20"> {/* Added pt-20 to add padding top */}
                {/* Navbar */}
                <RecentActivities />

                {/* Footer */}
            </div>
        </Layout>
    );
};

export default HomePage;









