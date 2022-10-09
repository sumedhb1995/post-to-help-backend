"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
const graphql_request_1 = require("graphql-request");
const find = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { body: { username, campaign_username }, } = req;
        if (!username || !campaign_username) {
            throw Error("No username found");
        }
        const queryProfile = graphql_request_1.gql `
		query Profile {
		  profile(request: { handle: "${username}" }) {
			id
			name
			bio
			attributes {
			  displayType
			  traitType
			  key
			  value
			}
			followNftAddress
			metadata
			isDefault
			picture {
			  ... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			  }
			  ... on MediaSet {
				original {
				  url
				  mimeType
				}
			  }
			  __typename
			}
			handle
			coverPicture {
			  ... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			  }
			  ... on MediaSet {
				original {
				  url
				  mimeType
				}
			  }
			  __typename
			}
			ownedBy
			dispatcher {
			  address
			  canUseRelay
			}
			stats {
			  totalFollowers
			  totalFollowing
			  totalPosts
			  totalComments
			  totalMirrors
			  totalPublications
			  totalCollects
			}
			followModule {
			  ... on FeeFollowModuleSettings {
				type
				amount {
				  asset {
					symbol
					name
					decimals
					address
				  }
				  value
				}
				recipient
			  }
			  ... on ProfileFollowModuleSettings {
				type
			  }
			  ... on RevertFollowModuleSettings {
				type
			  }
			}
		  }
		}  
	  `;
        const { profile: { id }, } = yield graphql_request_1.request({
            url: "https://api-mumbai.lens.dev/",
            document: queryProfile,
        });
        const query = graphql_request_1.gql `
			query Publications {
			  publications(
				request: {
				  profileId: "${id}"
				  publicationTypes: [POST]
				  limit: 50
				}
			  ) {
				items {
				  __typename
				  ... on Post {
					...PostFields
				  }
				  ... on Comment {
					...CommentFields
				  }
				  ... on Mirror {
					...MirrorFields
				  }
				}
				pageInfo {
				  prev
				  next
				  totalCount
				}
			  }
			}
	
			fragment MediaFields on Media {
			  url
			  mimeType
			}
	
			fragment ProfileFields on Profile {
			  id
			  name
			  bio
			  attributes {
				displayType
				traitType
				key
				value
			  }
			  isFollowedByMe
			  isFollowing(who: null)
			  followNftAddress
			  metadata
			  isDefault
			  handle
			  picture {
				... on NftImage {
				  contractAddress
				  tokenId
				  uri
				  verified
				}
				... on MediaSet {
				  original {
					...MediaFields
				  }
				}
			  }
			  coverPicture {
				... on NftImage {
				  contractAddress
				  tokenId
				  uri
				  verified
				}
				... on MediaSet {
				  original {
					...MediaFields
				  }
				}
			  }
			  ownedBy
			  dispatcher {
				address
			  }
			  stats {
				totalFollowers
				totalFollowing
				totalPosts
				totalComments
				totalMirrors
				totalPublications
				totalCollects
			  }
			  followModule {
				...FollowModuleFields
			  }
			}
	
			fragment PublicationStatsFields on PublicationStats {
			  totalAmountOfMirrors
			  totalAmountOfCollects
			  totalAmountOfComments
			}
	
			fragment MetadataOutputFields on MetadataOutput {
			  name
			  description
			  content
			  media {
				original {
				  ...MediaFields
				}
			  }
			  attributes {
				displayType
				traitType
				value
			  }
			}
	
			fragment Erc20Fields on Erc20 {
			  name
			  symbol
			  decimals
			  address
			}
	
			fragment PostFields on Post {
			  id
			  profile {
				...ProfileFields
			  }
			  stats {
				...PublicationStatsFields
			  }
			  metadata {
				...MetadataOutputFields
			  }
			  createdAt
			  collectModule {
				...CollectModuleFields
			  }
			  referenceModule {
				...ReferenceModuleFields
			  }
			  appId
			  hidden
			  reaction(request: null)
			  mirrors(by: null)
			  hasCollectedByMe
			}
	
			fragment MirrorBaseFields on Mirror {
			  id
			  profile {
				...ProfileFields
			  }
			  stats {
				...PublicationStatsFields
			  }
			  metadata {
				...MetadataOutputFields
			  }
			  createdAt
			  collectModule {
				...CollectModuleFields
			  }
			  referenceModule {
				...ReferenceModuleFields
			  }
			  appId
			  hidden
			  reaction(request: null)
			  hasCollectedByMe
			}
	
			fragment MirrorFields on Mirror {
			  ...MirrorBaseFields
			  mirrorOf {
				... on Post {
				  ...PostFields
				}
				... on Comment {
				  ...CommentFields
				}
			  }
			}
	
			fragment CommentBaseFields on Comment {
			  id
			  profile {
				...ProfileFields
			  }
			  stats {
				...PublicationStatsFields
			  }
			  metadata {
				...MetadataOutputFields
			  }
			  createdAt
			  collectModule {
				...CollectModuleFields
			  }
			  referenceModule {
				...ReferenceModuleFields
			  }
			  appId
			  hidden
			  reaction(request: null)
			  mirrors(by: null)
			  hasCollectedByMe
			}
	
			fragment CommentFields on Comment {
			  ...CommentBaseFields
			  mainPost {
				... on Post {
				  ...PostFields
				}
				... on Mirror {
				  ...MirrorBaseFields
				  mirrorOf {
					... on Post {
					  ...PostFields
					}
					... on Comment {
					  ...CommentMirrorOfFields
					}
				  }
				}
			  }
			}
	
			fragment CommentMirrorOfFields on Comment {
			  ...CommentBaseFields
			  mainPost {
				... on Post {
				  ...PostFields
				}
				... on Mirror {
				  ...MirrorBaseFields
				}
			  }
			}
	
			fragment FollowModuleFields on FollowModule {
			  ... on FeeFollowModuleSettings {
				type
				amount {
				  asset {
					name
					symbol
					decimals
					address
				  }
				  value
				}
				recipient
			  }
			  ... on ProfileFollowModuleSettings {
				type
				contractAddress
			  }
			  ... on RevertFollowModuleSettings {
				type
				contractAddress
			  }
			  ... on UnknownFollowModuleSettings {
				type
				contractAddress
				followModuleReturnData
			  }
			}
	
			fragment CollectModuleFields on CollectModule {
			  __typename
			  ... on FreeCollectModuleSettings {
				type
				followerOnly
				contractAddress
			  }
			  ... on FeeCollectModuleSettings {
				type
				amount {
				  asset {
					...Erc20Fields
				  }
				  value
				}
				recipient
				referralFee
			  }
			  ... on LimitedFeeCollectModuleSettings {
				type
				collectLimit
				amount {
				  asset {
					...Erc20Fields
				  }
				  value
				}
				recipient
				referralFee
			  }
			  ... on LimitedTimedFeeCollectModuleSettings {
				type
				collectLimit
				amount {
				  asset {
					...Erc20Fields
				  }
				  value
				}
				recipient
				referralFee
				endTimestamp
			  }
			  ... on RevertCollectModuleSettings {
				type
			  }
			  ... on TimedFeeCollectModuleSettings {
				type
				amount {
				  asset {
					...Erc20Fields
				  }
				  value
				}
				recipient
				referralFee
				endTimestamp
			  }
			  ... on UnknownCollectModuleSettings {
				type
				contractAddress
				collectModuleReturnData
			  }
			}
	
			fragment ReferenceModuleFields on ReferenceModule {
			  ... on FollowOnlyReferenceModuleSettings {
				type
				contractAddress
			  }
			  ... on UnknownReferenceModuleSettings {
				type
				contractAddress
				referenceModuleReturnData
			  }
			  ... on DegreesOfSeparationReferenceModuleSettings {
				type
				contractAddress
				commentsRestricted
				mirrorsRestricted
				degreesOfSeparation
			  }
			}
		  `;
        const data = yield graphql_request_1.request({
            url: "https://api-mumbai.lens.dev/",
            document: query,
        });
        const { publications: { items }, } = data;
        let publications = [];
        let results = {};
        let sumTotalUpvotes = 0;
        let sumTotalAmountOfMirrors = 0;
        let sumTotalAmountOfCollects = 0;
        let sumTotalAmountOfComments = 0;
        items.forEach((item) => {
            const { metadata: { description }, stats: { totalUpvotes, totalAmountOfMirrors, totalAmountOfCollects, totalAmountOfComments, }, } = item;
            if (Boolean(description) &&
                (description === null || description === void 0 ? void 0 : description.search(campaign_username)) !== -1) {
                sumTotalUpvotes = sumTotalUpvotes + totalUpvotes;
                sumTotalAmountOfMirrors =
                    sumTotalAmountOfMirrors + totalAmountOfMirrors;
                sumTotalAmountOfCollects =
                    sumTotalAmountOfCollects + totalAmountOfCollects;
                sumTotalAmountOfComments =
                    sumTotalAmountOfComments + totalAmountOfComments;
                results = {
                    sumTotalUpvotes,
                    sumTotalAmountOfMirrors,
                    sumTotalAmountOfCollects,
                    sumTotalAmountOfComments,
                };
                publications.push(item);
            }
        });
        const queryMentionedProfile = graphql_request_1.gql `
		query Profile {
		  profile(request: { handle: "${campaign_username}" }) {
			id
			name
			bio
			attributes {
			  displayType
			  traitType
			  key
			  value
			}
			followNftAddress
			metadata
			isDefault
			picture {
			  ... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			  }
			  ... on MediaSet {
				original {
				  url
				  mimeType
				}
			  }
			  __typename
			}
			handle
			coverPicture {
			  ... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			  }
			  ... on MediaSet {
				original {
				  url
				  mimeType
				}
			  }
			  __typename
			}
			ownedBy
			dispatcher {
			  address
			  canUseRelay
			}
			stats {
			  totalFollowers
			  totalFollowing
			  totalPosts
			  totalComments
			  totalMirrors
			  totalPublications
			  totalCollects
			}
			followModule {
			  ... on FeeFollowModuleSettings {
				type
				amount {
				  asset {
					symbol
					name
					decimals
					address
				  }
				  value
				}
				recipient
			  }
			  ... on ProfileFollowModuleSettings {
				type
			  }
			  ... on RevertFollowModuleSettings {
				type
			  }
			}
		  }
		}  
	  `;
        const resultQueryMentionedProfile = yield graphql_request_1.request({
            url: "https://api-mumbai.lens.dev/",
            document: queryMentionedProfile,
        });
        const queryCampaignPublications = graphql_request_1.gql `
		query Publications {
		  publications(
			request: {
			  profileId: "${resultQueryMentionedProfile.profile.id}"
			  publicationTypes: [POST]
			  limit: 10
			}
		  ) {
			items {
			  __typename
			  ... on Post {
				...PostFields
			  }
			  ... on Comment {
				...CommentFields
			  }
			  ... on Mirror {
				...MirrorFields
			  }
			}
			pageInfo {
			  prev
			  next
			  totalCount
			}
		  }
		}
	
		fragment MediaFields on Media {
		  url
		  mimeType
		}
	
		fragment ProfileFields on Profile {
		  id
		  name
		  bio
		  attributes {
			displayType
			traitType
			key
			value
		  }
		  isFollowedByMe
		  isFollowing(who: null)
		  followNftAddress
		  metadata
		  isDefault
		  handle
		  picture {
			... on NftImage {
			  contractAddress
			  tokenId
			  uri
			  verified
			}
			... on MediaSet {
			  original {
				...MediaFields
			  }
			}
		  }
		  coverPicture {
			... on NftImage {
			  contractAddress
			  tokenId
			  uri
			  verified
			}
			... on MediaSet {
			  original {
				...MediaFields
			  }
			}
		  }
		  ownedBy
		  dispatcher {
			address
		  }
		  stats {
			totalFollowers
			totalFollowing
			totalPosts
			totalComments
			totalMirrors
			totalPublications
			totalCollects
		  }
		  followModule {
			...FollowModuleFields
		  }
		}
	
		fragment PublicationStatsFields on PublicationStats {
		  totalAmountOfMirrors
		  totalAmountOfCollects
		  totalAmountOfComments
		}
	
		fragment MetadataOutputFields on MetadataOutput {
		  name
		  description
		  content
		  media {
			original {
			  ...MediaFields
			}
		  }
		  attributes {
			displayType
			traitType
			value
		  }
		}
	
		fragment Erc20Fields on Erc20 {
		  name
		  symbol
		  decimals
		  address
		}
	
		fragment PostFields on Post {
		  id
		  profile {
			...ProfileFields
		  }
		  stats {
			...PublicationStatsFields
		  }
		  metadata {
			...MetadataOutputFields
		  }
		  createdAt
		  collectModule {
			...CollectModuleFields
		  }
		  referenceModule {
			...ReferenceModuleFields
		  }
		  appId
		  hidden
		  reaction(request: { profileId: "0xaecd" })
		  mirrors(by: null)
		  hasCollectedByMe
		}
	
		fragment MirrorBaseFields on Mirror {
		  id
		  profile {
			...ProfileFields
		  }
		  stats {
			...PublicationStatsFields
		  }
		  metadata {
			...MetadataOutputFields
		  }
		  createdAt
		  collectModule {
			...CollectModuleFields
		  }
		  referenceModule {
			...ReferenceModuleFields
		  }
		  appId
		  hidden
		  reaction(request: null)
		  hasCollectedByMe
		}
	
		fragment MirrorFields on Mirror {
		  ...MirrorBaseFields
		  mirrorOf {
			... on Post {
			  ...PostFields
			}
			... on Comment {
			  ...CommentFields
			}
		  }
		}
	
		fragment CommentBaseFields on Comment {
		  id
		  profile {
			...ProfileFields
		  }
		  stats {
			...PublicationStatsFields
		  }
		  metadata {
			...MetadataOutputFields
		  }
		  createdAt
		  collectModule {
			...CollectModuleFields
		  }
		  referenceModule {
			...ReferenceModuleFields
		  }
		  appId
		  hidden
		  reaction(request: null)
		  mirrors(by: null)
		  hasCollectedByMe
		}
	
		fragment CommentFields on Comment {
		  ...CommentBaseFields
		  mainPost {
			... on Post {
			  ...PostFields
			}
			... on Mirror {
			  ...MirrorBaseFields
			  mirrorOf {
				... on Post {
				  ...PostFields
				}
				... on Comment {
				  ...CommentMirrorOfFields
				}
			  }
			}
		  }
		}
	
		fragment CommentMirrorOfFields on Comment {
		  ...CommentBaseFields
		  mainPost {
			... on Post {
			  ...PostFields
			}
			... on Mirror {
			  ...MirrorBaseFields
			}
		  }
		}
	
		fragment FollowModuleFields on FollowModule {
		  ... on FeeFollowModuleSettings {
			type
			amount {
			  asset {
				name
				symbol
				decimals
				address
			  }
			  value
			}
			recipient
		  }
		  ... on ProfileFollowModuleSettings {
			type
			contractAddress
		  }
		  ... on RevertFollowModuleSettings {
			type
			contractAddress
		  }
		  ... on UnknownFollowModuleSettings {
			type
			contractAddress
			followModuleReturnData
		  }
		}
	
		fragment CollectModuleFields on CollectModule {
		  __typename
		  ... on FreeCollectModuleSettings {
			type
			followerOnly
			contractAddress
		  }
		  ... on FeeCollectModuleSettings {
			type
			amount {
			  asset {
				...Erc20Fields
			  }
			  value
			}
			recipient
			referralFee
		  }
		  ... on LimitedFeeCollectModuleSettings {
			type
			collectLimit
			amount {
			  asset {
				...Erc20Fields
			  }
			  value
			}
			recipient
			referralFee
		  }
		  ... on LimitedTimedFeeCollectModuleSettings {
			type
			collectLimit
			amount {
			  asset {
				...Erc20Fields
			  }
			  value
			}
			recipient
			referralFee
			endTimestamp
		  }
		  ... on RevertCollectModuleSettings {
			type
		  }
		  ... on TimedFeeCollectModuleSettings {
			type
			amount {
			  asset {
				...Erc20Fields
			  }
			  value
			}
			recipient
			referralFee
			endTimestamp
		  }
		  ... on UnknownCollectModuleSettings {
			type
			contractAddress
			collectModuleReturnData
		  }
		}
	
		fragment ReferenceModuleFields on ReferenceModule {
		  ... on FollowOnlyReferenceModuleSettings {
			type
			contractAddress
		  }
		  ... on UnknownReferenceModuleSettings {
			type
			contractAddress
			referenceModuleReturnData
		  }
		  ... on DegreesOfSeparationReferenceModuleSettings {
			type
			contractAddress
			commentsRestricted
			mirrorsRestricted
			degreesOfSeparation
		  }
		}
		`;
        const resultQueryCampaignPublications = yield graphql_request_1.request({
            url: "https://api-mumbai.lens.dev/",
            document: queryCampaignPublications,
        });
        const getWhoReactedToPublication = (postId) => __awaiter(void 0, void 0, void 0, function* () {
            const queryWhoReacted = graphql_request_1.gql `
        query Likes($request: WhoReactedPublicationRequest!) {
          whoReactedPublication(request: $request) {
            items {
              reactionId
              profile {
                ...ProfileFields
                isFollowedByMe
                __typename
              }
              __typename
            }
            pageInfo {
              next
              totalCount
              __typename
            }
            __typename
          }
        }

        fragment ProfileFields on Profile {
          id
          name
          handle
          bio
          ownedBy
          attributes {
            key
            value
            __typename
          }
          picture {
            ... on MediaSet {
              original {
                url
                __typename
              }
              __typename
            }
            ... on NftImage {
              uri
              __typename
            }
            __typename
          }
          followModule {
            __typename
          }
          __typename
        }
      `;
            return graphql_request_1.request({
                url: "https://api-mumbai.lens.dev/",
                document: queryWhoReacted,
                variables: {
                    request: {
                        publicationId: postId,
                        limit: 10,
                    },
                },
            });
        });
        let countReactionFromUsername = 0;
        for (let i = 0; i < resultQueryCampaignPublications.publications.items.length; i++) {
            const campaignPublication = resultQueryCampaignPublications.publications.items[i];
            const { whoReactedPublication } = yield getWhoReactedToPublication(campaignPublication === null || campaignPublication === void 0 ? void 0 : campaignPublication.id);
            whoReactedPublication.items.forEach((whoReactedPublicationElement) => {
                if (whoReactedPublicationElement.profile.handle === username)
                    countReactionFromUsername = countReactionFromUsername + 1;
            });
        }
        res.status(200).json({
            posterData: { publications, results },
            supporterData: { countReactionFromUsername },
        });
    }
    catch (error) {
        res.status(200).json({
            posterData: {
                publications: [],
                results: {
                    sumTotalUpvotes: 0,
                    sumTotalAmountOfMirrors: 0,
                    sumTotalAmountOfCollects: 0,
                    sumTotalAmountOfComments: 0,
                },
                error,
            },
        });
    }
});
exports.find = find;
