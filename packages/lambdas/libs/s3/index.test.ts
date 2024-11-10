import { createPresignedUrl } from '.';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3');

describe('Given createPresignedUrl', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should create default s3 client', async () => {
        await createPresignedUrl(EXAMPLE_PRESIGNED_URL_PARAMS);

        expect(S3Client).toHaveBeenCalledWith({ region: 'eu-west-58' });
    });

    it('Should create a put object command', async () => {
        await createPresignedUrl(EXAMPLE_PRESIGNED_URL_PARAMS);

        const { path: key, bucket, metadata } = EXAMPLE_PRESIGNED_URL_PARAMS;

        expect(PutObjectCommand).toHaveBeenCalledWith({
            Key: key,
            Bucket: bucket,
            Metadata: metadata,
        });
    });

    it('Should create a presigned url', async () => {
        await createPresignedUrl(EXAMPLE_PRESIGNED_URL_PARAMS);

        expect(getSignedUrl).toHaveBeenCalledWith(
            expect.any(S3Client),
            expect.any(PutObjectCommand),
            { expiresIn: 1234 },
        );
    });

    it('Should return a presigned url', async () => {
        (getSignedUrl as jest.Mock).mockReturnValue('pre-signed-url');

        const url = await createPresignedUrl(EXAMPLE_PRESIGNED_URL_PARAMS);

        expect(url).toBe('pre-signed-url');
    });

    describe('When the region is not given', () => {
        it('should default to eu-west-2', async () => {
            await createPresignedUrl({
                ...EXAMPLE_PRESIGNED_URL_PARAMS,
                region: undefined,
            });

            expect(S3Client).toHaveBeenCalledWith({ region: 'eu-west-2' });
        });
    });

    describe('When the expirationTime is not given', () => {
        it('should default to 3600', async () => {
            await createPresignedUrl({
                ...EXAMPLE_PRESIGNED_URL_PARAMS,
                expirationTime: undefined,
            });

            expect(getSignedUrl).toHaveBeenCalledWith(
                expect.any(S3Client),
                expect.any(PutObjectCommand),
                { expiresIn: 3600 },
            );
        });
    });

    describe('When the metadata is not given', () => {
        it('should default to empty object', async () => {
            await createPresignedUrl({
                ...EXAMPLE_PRESIGNED_URL_PARAMS,
                metadata: {},
            });

            const {
                path: key,
                bucket,
                metadata,
            } = EXAMPLE_PRESIGNED_URL_PARAMS;

            expect(PutObjectCommand).toHaveBeenCalledWith({
                Key: key,
                Bucket: bucket,
                Metadata: {},
            });
        });
    });
});

const EXAMPLE_PRESIGNED_URL_PARAMS = {
    bucket: 'bucket-name',
    path: '/path/to/file.jpg',
    expirationTime: 1234,
    metadata: {
        'Metadata-one': 'value-one',
        'Metadata-two': 'value-two',
    },
    region: 'eu-west-58',
};
