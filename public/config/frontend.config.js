(function (window) {

            window._env = window._env || {};

            var config = {

                domain : window.document.domain,

                environments: [
                    "dev", "test", "qual", "stg"
                ],

                dev: '',

                test: '',

                qual: 'https://qualworld.wallstreetenglish.com',

                stg: 'https://stageworld.wallstreetenglish.com',

                prod: 'https://world.wallstreetenglish.com'

            };

            var baseUrl = null;

            try
            {
                /** Try it where we expect a match
                 * Used for all env. other than prod. as we
                 * do not have any keyword in the domain name for 'prod' env.
                 */
                config.environments.some(function(val) {

                    if(config.domain.indexOf(val) >= 0)
                    {
                        baseUrl = config[val];

                        if(config.domain.indexOf(".cn") >= 0 && config[val])
                        {
                            baseUrl += ".cn";
                        }

                        window._env = { assessmentBaseUrl: baseUrl + "/api/" };

                        return window._env;
                    }

                });


                /** Condition when none of the env.'s in config matches
                 * If succeeds, it's the prod. env.
                 * Also works the same for local but will not work for the
                 * url as we will limit its working by quickslot
                 */
                if(baseUrl == null)
                {
                    baseUrl = config['prod'];
                    // baseUrl = window.location.origin;

                    if(config.domain.indexOf(".cn") >= 0)
                    {
                        baseUrl += ".cn";
                    }

                    window._env = {
                      assessmentBaseUrl: baseUrl + "/api/",
                      redirectDomain: baseUrl
                    };

                    return window._env;
                }
            }
            catch(e)
            {
                console.log("Exception with env. config: ", e);
            }

    }(this));
