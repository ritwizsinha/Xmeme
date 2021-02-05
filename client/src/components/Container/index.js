import './style.css';
import MakePost from '../CreatePost';
import List from '../List';
const Container = ({ text }) => {
    return (
        <div className="main_container">
            <div className="secondary_container">
                <MakePost />
                <List />
            </div>
        </div>
    )
}

export default Container;