import { aliasMutation, aliasQuery, hasOperationName } from "../../../support/graphql-test-utils"

describe('test the home', ()=>{
  beforeEach(()=> {
    cy.visit('http://localhost:3333/programs/d88cc7d3-281b-4f06-8225-ccd9a38b85ad?visitIntro=1')
    cy.intercept('POST', 'https://rhdb-dev.kolable.com/v1/graphql', (req) => {
      aliasQuery(req, 'GetProgram')
    })
  })

  it('should not display any tasks opening for the first time', ()=>{
    cy.intercept('POST', 'https://rhdb-dev.kolable.com/v1/graphql', (req) => {
      if (hasOperationName(req, 'GetProgram')) {
        req.alias = 'GetProgram'

        req.reply((res) => {
          res.body = {
            "data": {
                "program_by_pk": {
                    "id": "d88cc7d3-281b-4f06-8225-ccd9a38b85ad",
                    "cover_url": "https://static-dev.kolable.com/program_covers/demo/d88cc7d3-281b-4f06-8225-ccd9a38b85ad/61e39549-a88d-441a-b1ce-62284bd9d270/1080",
                    "cover_mobile_url": "",
                    "cover_thumbnail_url": "",
                    "title": "我被修改啦～～～～",
                    "abstract": "幫是不良身我才自，來都安靜看到我⋯那己的會覺得面還意識不覺得，只是因好好的認親卡禮貌台灣⋯是什麼東原因不要。這首歌不是被隨便，旁很可以樣的遺這套換讓而，設定東西東西我快笑的字。有其實我推特是還是，之後像我不能看然。資料我就是有，也可在看跟很多人可以自天，家都⋯不想要所有其實我。也沒辦村民們二次元，直以為活動下來的⋯哈哈在自自動還真的，了吧安起有看。家人村民們啊啊心後英雄女的。這樣就。道以還是會沒有了：這麼別是因為。",
                    "published_at": "2024-06-20T09:32:56.475+00:00",
                    "is_subscription": false,
                    "is_sold_out": null,
                    "list_price": null,
                    "sale_price": null,
                    "sold_at": null,
                    "description": "{\"blocks\":[{\"key\":\"8bdsd\",\"text\":\"幫是不良身我才自，來都安靜看到我⋯那己的會覺得面還意識不覺得，只是因好好的認親卡禮貌台灣⋯是什麼東原因不要。這首歌不是被隨便，旁很可以樣的遺這套換讓而，設定東西東西我快笑的字。有其實我推特是還是，之後像我不能看然。資料我就是有，也可在看跟很多人可以自天，家都⋯不想要所有其實我。也沒辦村民們二次元，直以為活動下來的⋯哈哈在自自動還真的，了吧安起有看。家人村民們啊啊心後英雄女的。這樣就。道以還是會沒有了：這麼別是因為。幫是不良身我才自，來都安靜看到我⋯那己的會覺得面還意識不覺得，只是因好好的認親卡禮貌台灣⋯是什麼東原因不要。這首歌不是被隨便，旁很可以樣的遺這套換讓而，設定東西東西我快笑的字。有其實我推特是還是，之後像我不能看然。資料我就是有，也可在看跟很多人可以自天，家都⋯不想要所有其實我。也沒辦村民們二次元，直以為活動下來的⋯哈哈在自自動還真的，了吧安起有看。家人村民們啊啊心後英雄女的。這樣就。道以還是會沒有了：這麼別是因為。幫是不良身我才自，來都安靜看到我⋯那己的會覺得面還意識不覺得，只是因好好的認親卡禮貌台灣⋯是什麼東原因不要。這首歌不是被隨便，旁很可以樣的遺這套換讓而，設定東西東西我快笑的字。有其實我推特是還是，之後像我不能看然。資料我就是有，也可在看跟很多人可以自天，家都⋯不想要所有其實我。也沒辦村民們二次元，直以為活動下來的⋯哈哈在自自動還真的，了吧安起有看。家人村民們啊啊心後英雄女的。這樣就。道以還是會沒有了：這麼別是因為。幫是不良身我才自，來都安靜看到我⋯那己的會覺得面還意識不覺得，只是因好好的認親卡禮貌台灣⋯是什麼東原因不要。這首歌不是被隨便，旁很可以樣的遺這套換讓而，設定東西東西我快笑的字。有其實我推特是還是，之後像我不能看然。資料我就是有，也可在看跟很多人可以自天，家都⋯不想要所有其實我。也沒辦村民們二次元，直以為活動下來的⋯哈哈在自自動還真的，了吧安起有看。家人村民們啊啊心後英雄女的。這樣就。道以還是會沒有了：這麼別是因為。\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":836,\"style\":\"COLOR-333333\"},{\"offset\":0,\"length\":836,\"style\":\"FONTSIZE-17\"},{\"offset\":0,\"length\":836,\"style\":\"BGCOLOR-FFFFFF\"}],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
                    "cover_video_url": null,
                    "meta_tag": null,
                    "is_issues_open": false,
                    "is_private": false,
                    "is_countdown_timer_visible": false,
                    "is_introduction_section_visible": true,
                    "is_enrolled_count_visible": false,
                    "display_header": false,
                    "display_footer": true,
                    "cover_type": "image",
                    "mobile_cover_type": "image",
                    "activated_layout_template_config_id": "5bac6efe-50d6-43d8-af6a-d4076be50114",
                    "program_layout_template_config": {
                        "id": "5bac6efe-50d6-43d8-af6a-d4076be50114",
                        "program_layout_template_id": "c4782255-94ff-46a8-9fa9-383b7d0ed042",
                        "module_data": {
                            "2d668b9d-9fd5-47a4-9fef-b24184287233": 5000000,
                            "45ed6a40-bcb1-d478-88b6-a16ef3db1c92": "2024-07-23T16:00:00.065Z",
                            "e687ae28-27f0-4f92-aa23-3194704b6d8b": "2024-07-16T16:00:00.463Z",
                            "f3150ae5-9937-7244-f98b-2cb9401736d4": 5
                        },
                        "program_layout_template": {
                            "id": "c4782255-94ff-46a8-9fa9-383b7d0ed042",
                            "variant": "secondary",
                            "__typename": "program_layout_template"
                        },
                        "__typename": "program_layout_template_config"
                    },
                    "editors": [
                        {
                            "member_id": "6868e008-6d53-47f1-9fd3-072338baea87",
                            "__typename": "program_editor"
                        },
                        {
                            "member_id": "5a885b7a-f878-4fef-8726-53a01eda5811",
                            "__typename": "program_editor"
                        }
                    ],
                    "program_plans": [
                        {
                            "id": "31ecd46a-8f99-4f31-944f-adad2e2bbc23",
                            "__typename": "program_plan"
                        }
                    ],
                    "program_categories": [
                        {
                            "id": "a8bd1b98-33a4-4b23-9097-7a556319b41b",
                            "category": {
                                "id": "25f153ee-3e4b-4072-933e-548aaa1cd352",
                                "name": "企業內訓/第二層",
                                "__typename": "category"
                            },
                            "__typename": "program_category"
                        }
                    ],
                    "program_tags": [
                        {
                            "tag": {
                                "name": "教學",
                                "__typename": "tag"
                            },
                            "__typename": "program_tag"
                        }
                    ],
                    "program_roles": [
                        {
                            "id": "a1adb4a1-2a7c-4cfc-9cc9-d14eb451ae07",
                            "name": "owner",
                            "member_id": "6868e008-6d53-47f1-9fd3-072338baea87",
                            "member": {
                                "name": "test_test",
                                "description": "{\"blocks\":[{\"key\":\"2uqsr\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
                                "abstract": "",
                                "picture_url": null,
                                "__typename": "member_public"
                            },
                            "__typename": "program_role"
                        },
                        {
                            "id": "446ef3fc-bf82-4bf6-8d30-56e589950c59",
                            "name": "instructor",
                            "member_id": "5a885b7a-f878-4fef-8726-53a01eda5811",
                            "member": {
                                "name": "叫做MEMBER的content-creator",
                                "description": null,
                                "abstract": "（UAT）奮力做過教育前線的陪伴者，也曾迷上影像帶來的視界，這幾年一不小心跌入了媒體，每天都會提醒別忘了最真的自己。",
                                "picture_url": "https://static-dev.kolable.com/avatars/demo/5a885b7a-f878-4fef-8726-53a01eda5811/400",
                                "__typename": "member_public"
                            },
                            "__typename": "program_role"
                        }
                    ],
                    "program_review_score": {
                        "score": null,
                        "__typename": "program_review_score"
                    },
                    "program_duration": {
                        "duration": 14.883991,
                        "__typename": "program_duration"
                    },
                    "program_content_sections": [
                        {
                            "id": "1e0194e2-12cb-461d-8c0d-13d6acd7d831",
                            "title": "皮卡丘太極拳",
                            "description": null,
                            "collapsed_status": true,
                            "program_contents": [
                                {
                                    "id": "bd1f7f30-c9de-4d5a-9ae3-18e86195fe6a",
                                    "title": "我是完全不能播放的為發佈",
                                    "abstract": null,
                                    "metadata": null,
                                    "duration": 14.883991,
                                    "published_at": "2024-07-11T16:00:00+00:00",
                                    "display_mode": "payToWatch",
                                    "list_price": null,
                                    "sale_price": null,
                                    "sold_at": null,
                                    "content_body_id": "78b05216-86da-4827-9c5a-5e195ab43ddf",
                                    "pinned_status": false,
                                    "program_content_type": {
                                        "id": "bd1f7f30-c9de-4d5a-9ae3-18e86195fe6a",
                                        "type": "video",
                                        "__typename": "program_content_type"
                                    },
                                    "program_content_videos": [
                                        {
                                            "attachment": {
                                                "id": "5a2ef4e4-fe7b-42a7-b0be-64061707058b",
                                                "size": 628958,
                                                "options": {
                                                    "source": {
                                                        "s3": {
                                                            "video": "s3://storage-dev.kolable.com/vod/demo/5a/5a2ef4e4-fe7b-42a7-b0be-64061707058b/video/20240614151225_5a2ef4e4-fe7b-42a7-b0be-64061707058b"
                                                        }
                                                    },
                                                    "cloudfront": {
                                                        "status": "EMC_JOB_COMPLETE",
                                                        "playPaths": {
                                                            "hls": "https://media-dev.kolable.com/vod/demo/5a/5a2ef4e4-fe7b-42a7-b0be-64061707058b/output/hls/20240614151225_5a2ef4e4-fe7b-42a7-b0be-64061707058b.m3u8",
                                                            "dash": "https://media-dev.kolable.com/vod/demo/5a/5a2ef4e4-fe7b-42a7-b0be-64061707058b/output/dash/20240614151225_5a2ef4e4-fe7b-42a7-b0be-64061707058b.mpd"
                                                        }
                                                    }
                                                },
                                                "data": null,
                                                "__typename": "attachment"
                                            },
                                            "__typename": "program_content_video"
                                        }
                                    ],
                                    "program_content_audios": [],
                                    "program_content_ebook": null,
                                    "__typename": "program_content"
                                },
                                {
                                    "id": "8ea8f13c-4d82-4c7e-9647-3c000f5760de",
                                    "title": "皮卡丘太極拳大挑戰",
                                    "abstract": null,
                                    "metadata": null,
                                    "duration": null,
                                    "published_at": "2024-06-25T02:59:08.45+00:00",
                                    "display_mode": "payToWatch",
                                    "list_price": null,
                                    "sale_price": null,
                                    "sold_at": null,
                                    "content_body_id": "43cc2b59-5369-420d-a217-6fbf0b5de40d",
                                    "pinned_status": false,
                                    "program_content_type": {
                                        "id": "8ea8f13c-4d82-4c7e-9647-3c000f5760de",
                                        "type": "exam",
                                        "__typename": "program_content_type"
                                    },
                                    "program_content_videos": [],
                                    "program_content_audios": [],
                                    "program_content_ebook": null,
                                    "__typename": "program_content"
                                }
                            ],
                            "__typename": "program_content_section"
                        }
                    ],
                    "__typename": "program"
                }
            }
        }
        })
      }
    })

    
    cy.get('[data-testid="expectedStartDate"]').should('have.length', 1)
  })
})
