pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";


contract DiscussionApp is AragonApp {
    using SafeMath for uint256;

    event Post(address indexed author, string postCid, string discussionId, uint postId, uint createdAt);
    event Edit(address indexed author);
    event Hide(address indexed author, string discussionId, uint postId, uint hiddenAt);

    bytes32 constant public DISCUSSION_POSTER_ROLE = keccak256("DISCUSSION_POSTER_ROLE");

    struct DiscussionPost {
        address author;
        string postCid;
        string discussionId;
        uint id;
        uint createdAt;
        bool show;
    }

    mapping(address => DiscussionPost[]) public posts;

    function initialize() public onlyInit {
        initialized();
    }

    function post(address author, string postCid, string discussionId) external auth(DISCUSSION_POSTER_ROLE) {
        DiscussionPost storage post;
        post.author = author;
        post.postCid = postCid;
        post.discussionId = discussionId;
        post.createdAt = now;
        post.show = true;
        uint postId = posts[author].length;
        post.id = postId;
        posts[author].push(post);
        emit Post(author, postCid, discussionId, postId, now);
    }

    function hide(address author, uint postId, string discussionId) external auth(DISCUSSION_POSTER_ROLE) {
        DiscussionPost storage post = posts[author][postId];
        require(post.author == author, "You cannot hide a post you did not author.");
        post.show = false;
        emit Hide(author, discussionId, postId, now);
    }
}
