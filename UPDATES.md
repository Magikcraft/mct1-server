# Updating Worlds

-   Publish a new zip to S3.
-   Update the `mct1Worlds` key in `package.json`:

```json
"mct1Worlds": {
    "downloadUrl": "https://sitapatis-sydney-storage.s3.amazonaws.com/MCT1/mct1-worlds-0.1.1.zip",
    "version": "0.1.1"
}
```

-   During package installation, the installer checks the version of any locally installed worlds against the version in this key. If there is a higher version in the package.json, the installer will replace the local worlds with the updated ones.

_Question_: Should we save the existing ones? Will users want to mutate them?
