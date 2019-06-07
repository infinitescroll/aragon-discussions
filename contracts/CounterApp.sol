pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";


contract CounterApp is AragonApp {
    using SafeMath for uint256;

    event Post(address indexed author, string postCid, string discussionId, uint createdAt);
    event Edit(address indexed author);
    event Hide(address indexed author);

    bytes32 constant public DISCUSSION_POSTER_ROLE = keccak256("DISCUSSION_POSTER_ROLE");

    struct DiscussionPost {
        address author;
        string postCid;
        string discussionId;
        uint createdAt;
        uint discussionPostId;
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
        uint discussionPostId = posts[author].length;
        post.discussionPostId = discussionPostId;
        posts[author].push(post);
        emit Post(author, postCid, discussionId, now);
    }
}
