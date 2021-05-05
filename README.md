# recipe-saver-chrome

Chrome extension to save recipes in [`sugar-salt-butter`](https://github.com/ainhoaL/sugar-salt-butter-ui): application to organize food recipes.

## Setup
- Setup [`sugar-salt-butter`](https://github.com/ainhoaL/sugar-salt-butter#setup) and [`sugar-salt-butter-ui`](https://github.com/ainhoaL/sugar-salt-butter-ui#setup) if wanting to see in the web UI the recipes saved.
- Start [`sugar-salt-butter`] ((https://github.com/ainhoaL/sugar-salt-butter#start) (and [`sugar-salt-butter-ui`](https://github.com/ainhoaL/sugar-salt-butter-ui#start) if needed).
- In `recipe-saver-chrome/manifest.json`, set `oauth2.client_id` to ClientID obtained for the chrome extension in the [backend server setup step](https://github.com/ainhoaL/sugar-salt-butter#setup).
- Navigate to `chrome://extensions` in Chrome and load the unpacked extension. [More instructions in Chrome developer page](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest).

## Usage
- In Chrome, navigate to recipe page and open extension by clicking on `R` icon.
- Popup will open. Copy recipe details into fields and click Save.
    - Image is the href for the recipe image. For now images cannot be uploaded, just linked from websites.
    - Ingredients must be entered 1 ingredient per line. If needing ingredient groups, start the group name with `#`. For example:
    ```
    500g beef shin
    100g rice
    #Curry paste
    10g ginger
    1 chili
    ```
- After saving, a link will appear to navigate to the `sugar-salt-butter` web interface to see the saved recipe.