import './style.css';
import MakePost from '../CreatePost';
import List from '../List';
const Container = ({ text }) => {
    // Container component for add padding and margin to the body
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